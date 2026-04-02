import { 
  Connection, 
  PublicKey, 
  Transaction, 
  LAMPORTS_PER_SOL, 
  SystemProgram,
  ComputeBudgetProgram
} from "@solana/web3.js";
import { 
  getAssociatedTokenAddressSync, 
  createTransferInstruction, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";
import type { VerifiableExecutionPlan, SimulationResult } from "../compiler/types";

// Circle Devnet USDC Mint
const USDC_MINT = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
const USDC_DECIMALS = 6;
export async function buildSolanaTransaction(
  vPlan: VerifiableExecutionPlan,
  fromPubkey: PublicKey,
  connection: Connection
): Promise<Transaction> {
  const { plan, context } = vPlan;

  // 1. Strict Status Guard
  if (context.status !== "DETERMINISTIC") {
    throw new Error(`PLAN_NOT_EXECUTABLE: Current status is ${context.status}`);
  }

  // 2. Constraint Enforcement
  if (!plan.constraints.exactAmount || !plan.constraints.exactDestination) {
    throw new Error("PLAN_CONSTRAINT_VIOLATION: Interpreter requires strict enforcement.");
  }

  const step = plan.steps[0];
  if (!step || step.action !== "TRANSFER") {
    throw new Error("UNSUPPORTED_ACTION: Only TRANSFER is currently supported.");
  }

  const tx = new Transaction();

  // 0. Inject Priority Fees (Congestion Trap Mitigation)
  // 50,000 micro-lamports is a safe 'Medium' priority to ensure inclusion
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 }));
  
  // 3. Instruction Building (Native SOL vs SPL Token)
  const amount = parseFloat(step.amount);
  const destination = new PublicKey(step.destination);

  if (step.token === "USDC") {
    // USDC Execution Path (SPL)
    const mint = new PublicKey(USDC_MINT);
    const fromAta = getAssociatedTokenAddressSync(mint, fromPubkey);
    const toAta = getAssociatedTokenAddressSync(mint, destination);

    const atoms = Math.floor(amount * Math.pow(10, USDC_DECIMALS));

    // ATA Initialization (ATA Blindspot Mitigation)
    // Check if the recipient's ATA exists; if not, prepend the creation instruction.
    try {
      await getAccount(connection, toAta);
    } catch (e: any) {
      // If account doesn't exist, we must initialize it
      console.log(`[SETTLEMENT] Initializing new USDC associated account for ${destination.toBase58()}`);
      tx.add(
        createAssociatedTokenAccountInstruction(
          fromPubkey,
          toAta,
          destination,
          mint
        )
      );
    }

    tx.add(
      createTransferInstruction(
        fromAta,
        toAta,
        fromPubkey,
        atoms,
        [],
        TOKEN_PROGRAM_ID
      )
    );
  } else {
    // Standard SOL Execution Path (Native)
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
    tx.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: destination,
        lamports,
      })
    );
  }

  return tx;
}

/**
 * Internal retry helper with exponential backoff.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * Performs a pre-flight simulation on the constructed transaction.
 */
export async function simulateExecution(
  connection: Connection,
  transaction: Transaction,
  _fromPubkey: PublicKey
): Promise<SimulationResult> {
  try {
    const { value: simulation } = await withRetry(() =>
      connection.simulateTransaction(transaction)
    );

    if (simulation.err) {
      return {
        success: false,
        type: "SLIPPAGE",
        message: JSON.stringify(simulation.err),
        recoverable: true,
      };
    }

    return { success: true, recoverable: false };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const isNetworkError =
      errorMessage.includes("Failed to fetch") ||
      errorMessage.includes("blockhash") ||
      errorMessage.includes("429");
    return {
      success: false,
      type: "NETWORK",
      message: isNetworkError
        ? "Protocol RPC Congestion: Failed to reach Devnet. This is a network bottleneck. Retrying may help, or use a dedicated RPC provider."
        : errorMessage,
      recoverable: true,
    };
  }
}

/**
 * Fetches the latest blockhash from the network with institutional-grade error handling.
 */
export async function getLatestBlockhash(connection: Connection) {
  try {
    const { blockhash, lastValidBlockHeight } = await withRetry(() =>
      connection.getLatestBlockhash("finalized")
    );
    return { blockhash, lastValidBlockHeight };
  } catch (_err: unknown) {
    throw new Error(
      `PROTOCOL_CONGESTION: NETWORK_ERROR: Failed to fetch protocol blockhash after retries. Devnet is likely congested. Add NEXT_PUBLIC_SOLANA_RPC_URL to .env.local for dedicated access.`
    );
  }
}

export function getSolscanLink(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=devnet`;
}

/**
 * Translates cryptic Solana protocol errors into human-readable financial statuses.
 */
export function parseProtocolError(err: any): string {
  const message = err.message || String(err);
  const name = err.name || "";

  // 0. Wallet-level errors (occur before on-chain broadcast)
  // User explicitly rejected in their wallet extension.
  if (
    message.includes("User rejected") ||
    message.includes("Transaction cancelled") ||
    name === "WalletSignTransactionError"
  ) {
    return "Transaction Cancelled by User.";
  }

  // Phantom / Solflare throw a generic 'Unexpected error' when:
  // (a) wallet is locked, (b) there's a pending request, (c) session expired.
  if (
    (name === "WalletSendTransactionError" && message.includes("Unexpected error")) ||
    message.includes("WalletSendTransactionError")
  ) {
    return "Wallet Unavailable: Check that Phantom is unlocked and has no pending notifications, then retry.";
  }

  // Wallet connection dropped mid-session
  if (
    message.includes("WalletNotConnectedError") ||
    message.includes("Wallet not connected")
  ) {
    return "Wallet Disconnected: Please reconnect your wallet and try again.";
  }

  // 1. Handle JSON-stringified InstructionErrors from simulation
  if (message.includes("InstructionError")) {
    try {
      const parts = message.split("SIMULATION_FAILED: ");
      const rawJson = parts[1] || (message.includes("{") ? message.substring(message.indexOf("{")) : null);
      
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        const details = Array.isArray(parsed.InstructionError) ? parsed.InstructionError[1] : null;
        
        if (details?.Custom !== undefined) {
          switch (details.Custom) {
            case 1: return "Insufficient Liquidity (Your balance is too low to cover the transfer + fees).";
            case 5: return "Account Rent Error (Target account requires more SOL to exist).";
            default: return `Protocol Error Code: ${details.Custom}`;
          }
        }
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Handle standard network/timeout errors
  if (message.includes("timeout") || message.includes("not confirmed")) {
    return "Network Synchronization Lag (Transaction broadcasted, but confirmation is pending).";
  }

  if (message.includes("Blockhash not found") || message.includes("block height exceeded")) {
    return "Protocol Expired (Network was too congested or signature took too long. Retrying with fresh blockhash...).";
  }

  return message;
}

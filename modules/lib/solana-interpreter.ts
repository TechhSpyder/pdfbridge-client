import { 
  Connection, 
  PublicKey, 
  Transaction, 
  LAMPORTS_PER_SOL, 
  SystemProgram,
  ComputeBudgetProgram,
  TransactionInstruction
} from "@solana/web3.js";
import { 
  getAssociatedTokenAddressSync, 
  createTransferInstruction, 
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount
} from "@solana/spl-token";
import type { VerifiableExecutionPlan, SimulationResult } from "../compiler/types";

// Curated Institutional SPL Tokens (Devnet / Mainnet)
export const SUPPORTED_TOKENS: Record<string, { mint: string; decimals: number }> = {
  USDC: { mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", decimals: 6 }, // Devnet USDC
  USDT: { mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", decimals: 6 }, // USDT
  PYUSD: { mint: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZofHy1NNJM", decimals: 6 }, // PayPal USD
  EURC: { mint: "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKQ4G1u4k1H7", decimals: 6 }, // Circle Euro
};
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

  const tx = new Transaction();

  // 0. Inject Priority Fees (Congestion Trap Mitigation)
  // 50,000 micro-lamports is a safe 'Medium' priority to ensure inclusion
  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 }));
  
  for (const step of plan.steps) {
    if (step.action !== "TRANSFER" && step.action !== "TRANSFER_FEE") {
      throw new Error(`UNSUPPORTED_ACTION: Action ${step.action} is not supported.`);
    }

    // 3. Instruction Building (Native SOL vs SPL Token)
    const amount = parseFloat(step.amount);
    
    // SECURITY: Resolve the PROTOCOL_TREASURY sentinel to the real address from env.
    // The address is never stored in the API response — only this client env var.
    let resolvedDestination = step.destination;
    if (resolvedDestination === "PROTOCOL_TREASURY") {
      const treasury = process.env.NEXT_PUBLIC_PDFBRIDGE_TREASURY_WALLET;
      if (!treasury) {
        throw new Error(
          "PROTOCOL_MISCONFIGURED: NEXT_PUBLIC_PDFBRIDGE_TREASURY_WALLET is not set. " +
          "Fee routing is disabled. Configure the env var to enable settlement."
        );
      }
      resolvedDestination = treasury;
    }
    
    const destination = new PublicKey(resolvedDestination);

    // Skip self-transfers (e.g. if the Sender testing the invoice happens to be the Treasury Wallet)
    if (fromPubkey.equals(destination)) {
      continue;
    }

    if (step.token !== "SOL") {
      const tokenConfig = SUPPORTED_TOKENS[step.token];
      if (!tokenConfig) {
        throw new Error(`UNSUPPORTED_TOKEN: Token ${step.token} is not supported by PDFBridge Protocol.`);
      }

      // SPL Token Execution Path
      const mint = new PublicKey(tokenConfig.mint);
      const fromAta = getAssociatedTokenAddressSync(mint, fromPubkey);
      const toAta = getAssociatedTokenAddressSync(mint, destination);

      // SENDER ATA VALIDATION
      try {
        await getAccount(connection, fromAta);
      } catch (e: any) {
        throw new Error(`SENDER_NOT_INITIALIZED: Your wallet (${fromPubkey.toBase58()}) does not have an initialized ${step.token} account. Please request airdrop or fund it first.`);
      }

      const atoms = Math.floor(amount * Math.pow(10, tokenConfig.decimals));

      // ATA Initialization (ATA Blindspot Mitigation)
      try {
        await getAccount(connection, toAta);
      } catch (e: any) {
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
  }

  // 4. Attach Deterministic Settlement Anchor (SPL Memo)
  const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
  const baseIntentId = vPlan.intentId || vPlan.documentId;
  const invNumberString = vPlan.invoiceNumber ? `:${vPlan.invoiceNumber}` : '';
  const amountString = vPlan.totalAmount ? `:${vPlan.totalAmount}` : '';
  const anchorPayload = `pdfbridge:intent:${baseIntentId}${invNumberString}${amountString}`;
  tx.add(
   new TransactionInstruction({
     keys: [],
     programId: MEMO_PROGRAM_ID,
     data: Buffer.from(anchorPayload, "utf-8"),
   })
  );

  return tx;
}

/**
 * Institutional Basket Settlement
 * Builds an array of fully autonomous transactions, avoiding the 1232-byte protocol limit,
 * while allowing the CFO to sign them all simultaneously via `signAllTransactions`.
 */
export async function buildBatchTransactions(
  vPlans: VerifiableExecutionPlan[],
  fromPubkey: PublicKey,
  connection: Connection
): Promise<Transaction[]> {
  const transactions: Transaction[] = [];
  for (const plan of vPlans) {
    try {
      // Build individual txs. Errors on one shouldn't block the whole batch building process
      // but the UI will handle validation.
      const tx = await buildSolanaTransaction(plan, fromPubkey, connection);
      transactions.push(tx);
    } catch (e) {
      console.error(`[BATCHER] Failed to build transaction for intent ${plan.intentId}:`, e);
      throw e; // Fail fast for security
    }
  }
  return transactions;
}

/**
 * Institutional Treasury Guard
 * Verifies that the connected wallet has sufficient liquidity for the total batch.
 * Implements the "Hard Block" standard: Balance must exceed Total + 0.05 SOL Buffer.
 */
export async function checkLiquidity(
  amounts: { amount: number; token: string }[],
  fromPubkey: PublicKey,
  connection: Connection
): Promise<{ 
  isSufficient: boolean; 
  balance: number; 
  required: number; 
  token: string 
}> {
  // Focus on SOL for the initial mandatory liquidity guard (fee safety)
  const totalSOL = amounts
    .filter(a => a.token === "SOL")
    .reduce((acc, a) => acc + a.amount, 0);
  
  const solBalance = await connection.getBalance(fromPubkey);
  const solBalanceInSOL = solBalance / LAMPORTS_PER_SOL;
  
  // Buffer of 0.05 SOL for rent + fees
  const requiredSOL = totalSOL + 0.05;
  
  return {
    isSufficient: solBalanceInSOL >= requiredSOL,
    balance: solBalanceInSOL,
    required: requiredSOL,
    token: "SOL"
  };
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
  if (
    message.includes("User rejected") ||
    message.includes("Transaction cancelled") ||
    name === "WalletSignTransactionError"
  ) {
    return "Transaction Cancelled: You declined the request in your wallet.";
  }

  if (
    message.includes("WalletNotConnectedError") ||
    message.includes("Wallet not connected")
  ) {
    return "Wallet Disconnected: Please reconnect your wallet and try again.";
  }

  if (
    (name === "WalletSendTransactionError" && message.includes("Unexpected error")) ||
    message.includes("WalletSendTransactionError")
  ) {
    return "Wallet Busy: Your wallet is currently busy or locked. Please unlock it and check for pending requests.";
  }

  // 1. Technical "Program" Errors (mapped to human concepts)
  if (message.includes("ProgramAccountNotFound") || message.includes("AccountNotFound")) {
    return "Network Congestion: The ledger is currently very busy syncing. Please wait 10 seconds and try again.";
  }

  if (message.includes("Attempt to debit an account but found no record of a prior credit")) {
    return "Wallet Setup Required: Your wallet needs a one-time setup to receive this currency. PDFBridge handles this automatically—please wait a moment and refresh.";
  }

  // 2. Logic & Balance Errors
  if (message.includes("InstructionError")) {
    try {
      const parts = message.split("SIMULATION_FAILED: ");
      const rawJson = parts[1] || (message.includes("{") ? message.substring(message.indexOf("{")) : null);
      
      if (rawJson) {
        const parsed = JSON.parse(rawJson);
        const details = Array.isArray(parsed.InstructionError) ? parsed.InstructionError[1] : null;
        
        if (details?.Custom !== undefined) {
          switch (details.Custom) {
            case 1: return "Insufficient Balance: You don't have enough funds in your wallet to cover the invoice and the small network fee.";
            case 5: return "Account Inactive: The destination account isn't fully set up on the network yet.";
            default: break;
          }
        }
      }
    } catch (e) { /* Fallback */ }
  }

  // 3. Network Connection & Timing
  if (message.includes("timeout") || message.includes("not confirmed")) {
    return "Syncing in Progress: Your transaction was sent! The network is just taking a moment to confirm it. Check back in 30 seconds.";
  }

  if (message.includes("Blockhash not found") || message.includes("block height exceeded")) {
    return "Connection Expired: The network took too long to respond due to high traffic. We've refreshed the session—please try one more time.";
  }

  if (message.includes("429") || message.includes("Too Many Requests") || message.includes("Failed to fetch")) {
    return "High Traffic: We're experiencing heavy network volume. Please wait a few seconds and try again.";
  }

  // Default fallback
  return "Settlement Interrupted: Something went wrong with the connection. Please check your wallet and try again.";
}

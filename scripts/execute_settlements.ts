/**
 * [IDENTITY B] PDFBridge M2M Settlement Execution Script
 * Colosseum Hackathon Demo — Engine Room Scene
 *
 * Run from pdfbridge-client directory:
 *   npx tsx scripts/execute_settlements.ts
 */
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  ComputeBudgetProgram,
  sendAndConfirmTransaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import * as dotenv from "dotenv";
import bs58 from "bs58";
import * as path from "path";

// Load the API's env file since the private key lives there
const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, "../pdfbridge-api/.env.development") });

// ─── Configuration ────────────────────────────────────────────────────────────
const API_KEY = "pb_0f70244c2bf99baeafe3b6d0d5b3481709b7ac3e160f9b9e"; // Identity B
const API_URL = "http://localhost:3003";
const DEVNET_USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const TREASURY_WALLET = process.env.PDFBRIDGE_TREASURY_WALLET || "6NNh8CDeVYS78jowsjJ3W2dpHjwbWfjdEKVpqrYRUBjr";
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

async function buildUsdcTransfer(
  connection: Connection,
  fromPubkey: PublicKey,
  toPubkey: PublicKey,
  amountUsdc: number,
  intentId: string,
  invoiceNumber: string,
): Promise<Transaction> {
  const tx = new Transaction();

  tx.add(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50_000 }));

  const mint = new PublicKey(DEVNET_USDC_MINT);
  const fromAta = getAssociatedTokenAddressSync(mint, fromPubkey);
  const toAta = getAssociatedTokenAddressSync(mint, toPubkey);
  const atoms = Math.floor(amountUsdc * 1_000_000);

  // Initialize recipient ATA if needed
  try {
    await getAccount(connection, toAta);
  } catch {
    console.log(`│  📋 Initializing recipient USDC account...`);
    tx.add(createAssociatedTokenAccountInstruction(fromPubkey, toAta, toPubkey, mint));
  }

  tx.add(createTransferInstruction(fromAta, toAta, fromPubkey, atoms, [], TOKEN_PROGRAM_ID));

  // Protocol fee (skip self-transfers)
  const treasury = new PublicKey(TREASURY_WALLET);
  if (!fromPubkey.equals(treasury)) {
    const treasuryAta = getAssociatedTokenAddressSync(mint, treasury);
    const feeAtoms = Math.floor(0.05 * 1_000_000);
    try {
      await getAccount(connection, treasuryAta);
      tx.add(createTransferInstruction(fromAta, treasuryAta, fromPubkey, feeAtoms, [], TOKEN_PROGRAM_ID));
    } catch {
      // Treasury ATA not initialized — skip fee for demo
    }
  }

  // Deterministic settlement anchor
  const anchor = `pdfbridge:intent:${intentId}:${invoiceNumber}:${amountUsdc}`;
  tx.add(new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(anchor, "utf-8"),
  }));

  return tx;
}

async function run() {
  console.log("\x1b[35m%s\x1b[0m", "\n══════════════════════════════════════════════════");
  console.log("\x1b[35m%s\x1b[0m",   "  [IDENTITY B] M2M SETTLEMENT ENGINE — ACTIVE");
  console.log("\x1b[35m%s\x1b[0m",   "══════════════════════════════════════════════════\n");

  // ─── Load Wallet ────────────────────────────────────────────────────────────
  const rawKey = process.env.DEMO_PRIVATE_KEY;
  if (!rawKey) {
    console.error("\x1b[31m❌ FATAL: DEMO_PRIVATE_KEY not found in pdfbridge-api/.env.development\x1b[0m");
    process.exit(1);
  }

  let wallet: Keypair;
  try {
    wallet = rawKey.startsWith("[")
      ? Keypair.fromSecretKey(Uint8Array.from(JSON.parse(rawKey)))
      : Keypair.fromSecretKey(bs58.decode(rawKey));
  } catch {
    console.error("\x1b[31m❌ Invalid key format. Paste a Base58 string or a [JSON array].\x1b[0m");
    process.exit(1);
  }

  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
  const connection = new Connection(rpcUrl, "confirmed");

  console.log(`💳 Principal:   ${wallet.publicKey.toBase58()}`);
  console.log(`🔑 Scoped Key:  ${API_KEY.slice(0, 16)}...`);
  console.log(`🌐 API Target:  ${API_URL}`);
  console.log(`⛓️  RPC:         ${rpcUrl}\n`);

  // ─── Fetch Payout Queue ──────────────────────────────────────────────────────
  const ledgerResp = await fetch(`${API_URL}/api/v1/ledger?reconciledOnly=true&limit=20`, {
    headers: { "x-api-key": API_KEY },
  });

  if (!ledgerResp.ok) {
    console.error("❌ Ledger fetch failed:", await ledgerResp.json());
    process.exit(1);
  }

  const { documents } = await ledgerResp.json();
  const queue = documents.filter(
    (d: any) => d.vendorName === "Colosseum Infra Ltd" && d.status !== "SETTLED"
  );

  if (queue.length === 0) {
    console.log("\x1b[33m⚠️  No pending Colosseum invoices found. Run seed_demo_data.ts first.\x1b[0m");
    process.exit(0);
  }

  console.log(`📡 Payout Queue: ${queue.length} institutional payloads\n`);

  let succeeded = 0;
  let failed = 0;

  for (const doc of queue) {
    console.log(`\x1b[36m┌── ${doc.invoiceNumber} ─────────────────────────────────┐\x1b[0m`);
    console.log(`│  Amount: ${doc.totalAmount} ${doc.currency}`);
    console.log(`│  Vendor: ${doc.vendorName}`);

    try {
      // ─── Compile Intent via M2M Auth ──────────────────────────────────────
      console.log(`│\n│  🔄 Compiling execution intent...`);
      const compileResp = await fetch(`${API_URL}/api/v1/compiler/compile-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ documentId: doc.id }),
      });

      const intent = await compileResp.json();

      if (!compileResp.ok || intent.error) {
        throw new Error(`Compile error: ${intent.error || intent.message}`);
      }
      if (intent.context?.status !== "DETERMINISTIC") {
        const codes = intent.context?.diagnostics?.map((d: any) => d.code).join(", ");
        throw new Error(`Not executable — status: ${intent.context?.status} | ${codes}`);
      }

      const paymentStep = intent.plan?.steps?.[0];
      if (!paymentStep || paymentStep.destination === "UNKNOWN") {
        throw new Error("No valid payment destination in compiled plan.");
      }

      console.log(`│  ✅ Intent: ${intent.intentId.slice(0, 20)}...`);
      console.log(`│  📍 Recipient: ${paymentStep.destination.slice(0, 20)}...`);

      // ─── Build + Sign Transaction ──────────────────────────────────────────
      const recipientPubkey = new PublicKey(paymentStep.destination);
      const amount = parseFloat(paymentStep.amount);
      const { blockhash } = await connection.getLatestBlockhash("confirmed");

      console.log(`│\n│  ⚙️  Building USDC transfer (${amount} USDC)...`);
      const tx = await buildUsdcTransfer(
        connection, wallet.publicKey, recipientPubkey,
        amount, intent.intentId, doc.invoiceNumber
      );
      tx.recentBlockhash = blockhash;
      tx.feePayer = wallet.publicKey;

      console.log(`│  ✍️  Signing with Identity B...`);
      const signature = await sendAndConfirmTransaction(connection, tx, [wallet], {
        commitment: "confirmed",
      });

      console.log(`│\n│  \x1b[32m✅ SETTLED ON-CHAIN\x1b[0m`);
      console.log(`│  🔗 https://solscan.io/tx/${signature}?cluster=devnet`);

      // ─── Sync Ledger ──────────────────────────────────────────────────────
      await fetch(`${API_URL}/api/v1/compiler/intent/${intent.intentId}/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ signature, payingWallet: wallet.publicKey.toBase58() }),
      });
      console.log(`│  📁 Ledger synchronized.`);
      succeeded++;

    } catch (e: any) {
      console.error(`│\n│  \x1b[31m❌ FAILED: ${e.message}\x1b[0m`);
      failed++;
    }

    console.log(`\x1b[36m└───────────────────────────────────────────────────┘\x1b[0m\n`);
  }

  console.log("\x1b[35m%s\x1b[0m", "══════════════════════════════════════════════════");
  console.log(`  RESULT: \x1b[32m${succeeded} settled\x1b[0m · \x1b[31m${failed} failed\x1b[0m`);
  console.log("\x1b[35m%s\x1b[0m", "══════════════════════════════════════════════════\n");
  process.exit(0);
}

run().catch((err) => {
  console.error("\x1b[31mUNEXPECTED ERROR:\x1b[0m", err);
  process.exit(1);
});

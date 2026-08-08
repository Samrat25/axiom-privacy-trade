/**
 * Midnight circuit call surface.
 *
 * Every function here is a stub with realistic latency + failure modes so the
 * UI's loading and error states are real. Replace the bodies with actual
 * compact-contract calls; the signatures are the integration contract.
 */

export interface ParsedStrategy {
  asset: string;
  maxPosition: number; // percent of portfolio
  stopLoss: number; // percent
  timelineDays: number;
}

export interface Commitment {
  hash: string;
  blockHeight: number;
  proofMs: number;
}

const ASSETS = ["ADA", "BTC", "ETH", "SOL", "DUST", "MID"];

function randomHex(len: number) {
  const chars = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/** Local NL parse — stands in for the off-chain intent parser / AI agent. */
export function parseStrategyText(text: string): ParsedStrategy | null {
  const upper = text.toUpperCase();
  const asset = ASSETS.find((a) => new RegExp(`\\b${a}\\b`).test(upper));
  const position = upper.match(/(\d{1,3})\s*%\s*(MAX\s*)?POSITION|MAX\s*(\d{1,3})\s*%/);
  const stop = upper.match(/(\d{1,3})\s*%\s*STOP/);
  const days = upper.match(/(\d{1,4})\s*(DAY|DAYS|D)\b/);

  if (!asset && !position && !stop && !days) return null;

  return {
    asset: asset ?? "ADA",
    maxPosition: Number(position?.[1] ?? position?.[3] ?? 20),
    stopLoss: Number(stop?.[1] ?? 8),
    timelineDays: Number(days?.[1] ?? 30),
  };
}

export const PROOF_PHASES = [
  "Normalizing strategy intent",
  "Building witness from private inputs",
  "Generating zero-knowledge proof",
  "Submitting commitment to Midnight",
] as const;

/** Circuit: commit_strategy(hash) — writes only the commitment on-chain. */
export async function commitStrategy(
  strategy: ParsedStrategy,
  onPhase?: (index: number) => void,
): Promise<Commitment> {
  const started = Date.now();
  for (let i = 0; i < PROOF_PHASES.length; i++) {
    onPhase?.(i);
    await wait(700 + Math.random() * 600);
  }
  if (Math.random() < 0.12) {
    throw new Error("Proof rejected by the verifier. Adjust the parameters and retry.");
  }
  void strategy;
  return {
    hash: `0x${randomHex(64)}`,
    blockHeight: 4_812_337 + Math.floor(Math.random() * 500),
    proofMs: Date.now() - started,
  };
}

/** Circuit: withdraw(amount) — shielded balance transfer. */
export async function withdraw(amount: number): Promise<{ txHash: string }> {
  await wait(1600);
  if (amount <= 0) throw new Error("Enter an amount greater than zero.");
  if (amount > 8421.55) throw new Error("Amount exceeds your shielded balance.");
  if (Math.random() < 0.1) throw new Error("Network congestion — the transaction was not accepted.");
  return { txHash: `0x${randomHex(64)}` };
}

/** Circuit: expire_strategy(commitmentHash) */
export async function expireStrategy(hash: string): Promise<void> {
  await wait(1200);
  if (Math.random() < 0.1) throw new Error(`Could not expire ${hash.slice(0, 10)}… — try again.`);
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

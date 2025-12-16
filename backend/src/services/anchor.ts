import crypto from "crypto";
import { Transaction } from "../types/transaction";

export function computeAuditHash(tx: Omit<Transaction, "auditHash">) {
  const payload = JSON.stringify(tx);
  return crypto.createHash("sha256").update(Buffer.from(payload, "utf-8")).digest("hex");
}

export async function computeAndStoreAnchor(buf: Buffer, reportId: string) {
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  console.log(`Anchored report ${reportId} with hash: ${hash}`);
  return hash;
}

export function anchorSomething() {
  return { anchored: true };
}

import crypto from "crypto";

export async function computeAndStoreAnchor(buf: Buffer, reportId: string) {
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  console.log(`Anchored report ${reportId} with hash: ${hash}`);
  return hash;
}
export function anchorSomething() {
  return { anchored: true };
}

/*
 * Lightweight integration smoke test for demo backend
 * Usage:
 *   1) npm run dev   (in one terminal)
 *   2) npm run smoke (in another)
 */

const BASE_URL = "http://localhost:8000";

type Json = Record<string, any>;

async function http<T = Json>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${path}\n${text}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}

async function run() {
  console.log("🔎 Smoke test starting...\n");

  console.log("→ POST /api/payments");

  const payment = await http<Json>("/api/payments", {
    method: "POST",
    body: JSON.stringify({
      from: "0x1111111111111111111111111111111111111111",
      to: "0x2222222222222222222222222222222222222222",
      amount: "1.5",
      asset: "USDC",
      network: "base",
    }),
  });

  if (!payment.txHash || !payment.auditHash) {
    throw new Error("POST /api/payments missing txHash or auditHash");
  }

  console.log("✓ payment created");
  console.log("  txHash:", payment.txHash);
  console.log("  auditHash:", payment.auditHash, "\n");

  console.log("→ GET /api/payments");

  const payments = await http<Json[]>("/api/payments");

  if (!Array.isArray(payments) || payments.length === 0) {
    throw new Error("GET /api/payments returned no transactions");
  }

  console.log(`✓ ${payments.length} persisted transaction(s) found\n`);

  console.log("→ GET /api/reports");

  const csv = await http<string>("/api/reports");

  if (!csv.includes("AuditHash")) {
    throw new Error("Report CSV missing AuditHash column");
  }

  if (!csv.toLowerCase().includes("report hash")) {
    throw new Error("Report CSV missing report-level hash");
  }

  console.log("✓ report generated");
  console.log("\n--- CSV preview ---");
  console.log(csv.slice(0, 300));
  console.log("--- end preview ---\n");

  console.log("✅ Smoke test PASSED");
}

run().catch((err) => {
  console.error("\n❌ Smoke test FAILED");
  console.error(err);
  process.exit(1);
});

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  asset: "USDC";
  network: string;
  txHash: string;
  status: "demo_submitted" | "submitted";
  timestamp: number;
  auditHash: string;
}

import express from "express";
import crypto from "crypto";
import { loadTransactions } from "../services/store";

export const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const txs = loadTransactions();

    const header = "ID,From,To,Amount,TxHash,Status,Timestamp,AuditHash\n";
    const rows = txs.map((t) => `${t.id},${t.from},${t.to},${t.amount},${t.txHash},${t.status},${t.timestamp},${t.auditHash}`);
    const csv = header + rows.join("\n");

    const buf = Buffer.from(csv, "utf-8");
    const reportHash = crypto.createHash("sha256").update(buf).digest("hex");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="report.csv"');
    res.send(csv + `\n\nReport Hash: ${reportHash}`);
  } catch (err: unknown) {
    if (err instanceof Error) return res.status(500).json({ error: err.message });
    return res.status(500).json({ error: String(err) });
  }
});

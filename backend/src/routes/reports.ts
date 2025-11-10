import express from "express";
import crypto from "crypto";

export const router = express.Router();

router.get("/", async (_, res) => {
  try {
    const rows = [
      { id: 1, amount: 25, tx_hash: "0xabc111" },
      { id: 2, amount: 45, tx_hash: "0xabc222" },
      { id: 3, amount: 10, tx_hash: "0xabc333" }
    ];

    const csv = "ID,Amount,TxHash\n" +
      rows.map(r => `${r.id},${r.amount},${r.tx_hash}`).join("\n");

    const hash = crypto.createHash("sha256").update(csv).digest("hex");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="report.csv"');
    res.send(csv + `\n\nReport Hash: ${hash}`);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

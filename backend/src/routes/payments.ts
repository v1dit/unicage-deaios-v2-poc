import express from "express";
export const router = express.Router();

// demo transactions
const txs = [
  { id: 1, tx_hash: "0xabc111", amount: "25", status: "confirmed" },
  { id: 2, tx_hash: "0xabc222", amount: "45", status: "confirmed" },
  { id: 3, tx_hash: "0xabc333", amount: "10", status: "pending" }
];

// GET /api/payments  → list txs
router.get("/", (_, res) => res.json(txs));

// POST /api/payments  → simulate new tx
router.post("/", (req, res) => {
  const { amount } = req.body;
  const newTx = {
    id: txs.length + 1,
    tx_hash: `0xmock${Math.floor(Math.random() * 999999)}`,
    amount,
    status: "pending"
  };
  txs.push(newTx);
  res.json(newTx);
});

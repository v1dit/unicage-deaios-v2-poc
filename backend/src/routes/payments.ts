import express from "express";
export const router = express.Router();

// demo transactions
const txs = [
  { id: 1, tx_hash: "0xabc111", amount: "25", status: "confirmed", from: "0xdemoA", to: "0xdemo1", mode: "demo" },
  { id: 2, tx_hash: "0xabc222", amount: "45", status: "confirmed", from: "0xdemoB", to: "0xdemo2", mode: "demo" },
  { id: 3, tx_hash: "0xabc333", amount: "10", status: "pending", from: "0xdemoC", to: "0xdemo3", mode: "demo" }
];

// GET /api/payments  → list txs
router.get("/", (_, res) => res.json(loadTransactions()));

// POST /api/payments  → demo or real transfer
import { TokenService } from "../services/token";
import { isAddress } from "ethers";
import { computeAuditHash } from "../services/anchor";
import { saveTransaction, loadTransactions } from "../services/store";
import { Transaction } from "../types/transaction";

const tokenService = new TokenService();

router.post("/", async (req, res) => {
  try {
    const { from, to, amount, asset, network } = req.body;
    if (!from || !to) return res.status(400).json({ error: "from and to required" });
    if (!isAddress(from) || !isAddress(to)) return res.status(400).json({ error: "invalid address" });

    const usedAsset = asset || "USDC";
    const usedNetwork = network || "base-sepolia (demo)";

    // Use TokenService.transfer(from,to,amount)
    const result = await tokenService.transfer(from, to, amount);

    const status = result.status || "demo";
    const txHash = result.txHash;

    const baseTx: Omit<Transaction, "auditHash"> = {
      id: `tx_${Date.now()}`,
      from,
      to,
      amount,
      asset: "USDC",
      network: usedNetwork,
      txHash,
      status: status === "demo" ? "demo_submitted" : "submitted",
      timestamp: Date.now()
    };

    const auditHash = computeAuditHash(baseTx);
    const fullTx: Transaction = { ...baseTx, auditHash };
    saveTransaction(fullTx);

    res.json(fullTx);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

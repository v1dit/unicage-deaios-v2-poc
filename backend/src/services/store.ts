import fs from "fs";
import path from "path";
import { Transaction } from "../types/transaction";

const FILE = path.join(__dirname, "../../data/transactions.json");

export function loadTransactions(): Transaction[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const raw = fs.readFileSync(FILE, "utf-8");
    return JSON.parse(raw) as Transaction[];
  } catch (err) {
    console.error("Failed to load transactions:", err);
    return [];
  }
}

export function saveTransaction(tx: Transaction) {
  const txs = loadTransactions();
  txs.push(tx);
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(txs, null, 2), "utf-8");
}

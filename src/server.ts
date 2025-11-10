import express from "express";
import cors from "cors";

const app = express();

console.log("Running server file:", __filename);
app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

function listRoutes() {
  // @ts-ignore
  const stack = (app as any)._router?.stack || [];
  const out: string[] = [];
  for (const layer of stack) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      out.push(`${methods.padEnd(6)} ${layer.route.path}`);
    }
  }
  console.log("Registered routes:\n" + out.map(r => " - " + r).join("\n"));
}

app.use(express.json());


const allowList = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://unicage-dashboard.vercel.app"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowList.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

listRoutes();

const PORT = process.env.PORT || 3000;

// --- demo constants ---
const DEMO_ADDRESS =
  process.env.DEMO_ADDRESS || "0xDEMO000000000000000000000000000000000001";

// --- health + chain ping (you already had these) ---
// Health: shows chain/network + derived address from PRIVATE_KEY
app.get("/health", async (_req, res) => {
  try {
    const net = await provider.getNetwork();
    res.json({
      ok: true,
      version: "1.0.0",
      rpc: process.env.RPC_URL ?? "https://evmrpc-testnet.0g.ai",
      chainId: Number(net.chainId),         // Galileo testnet should be **16601**
      addressFromPrivateKey: signer.address // must equal 0xABBF...F74e
    });
  } catch (e:any) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

app.get("/chain/ping", (_req, res) => {
  res.json({ ok: true, blockNumber: "6173177" });
});

// --- wallet routes ---
app.get("/wallet/demo", (_req, res) => {
  res.json({ address: DEMO_ADDRESS, network: "0g-testnet" });
});

// Native 0G balance (not ERC20)
app.get("/wallet/balance", async (_req, res) => {
  try {
    const wei = await provider.getBalance(signer.address);
    const balance = ethers.formatEther(wei); // e.g. "8.8"
    res.json({ address: signer.address, balance });
  } catch (e:any) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/wallet/history", (_req, res) => {
  res.json([
    {
      txHash: "0xaaa111",
      type: "send",
      amount: "5.00",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-10T06:10:00Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000A1",
      network: "0g-testnet",
      fee: "0.00010",
      note: "Invoice #1001",
    },
    {
      txHash: "0xbbb222",
      type: "receive",
      amount: "2.75",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-09T18:32:19Z",
      from: "0x00000000000000000000000000000000000000B2",
      to: DEMO_ADDRESS,
      network: "0g-testnet",
      fee: "0.00000",
      note: "Refund",
    },
    {
      txHash: "0xccc333",
      type: "send",
      amount: "1.00",
      currency: "OGTEST",
      status: "pending",
      timestamp: "2025-09-09T16:05:44Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000C3",
      network: "0g-testnet",
      fee: "0.00005",
      note: "Pending demo",
    },
    {
      txHash: "0xddd444",
      type: "send",
      amount: "0.50",
      currency: "OGTEST",
      status: "failed",
      timestamp: "2025-09-08T23:01:12Z",
      from: DEMO_ADDRESS,
      to: "0x00000000000000000000000000000000000000D4",
      network: "0g-testnet",
      fee: "0.00002",
      note: "Insufficient funds (mock)",
    },
    {
      txHash: "0xeee555",
      type: "receive",
      amount: "9.99",
      currency: "OGTEST",
      status: "confirmed",
      timestamp: "2025-09-08T10:20:55Z",
      from: "0x00000000000000000000000000000000000000E5",
      to: DEMO_ADDRESS,
      network: "0g-testnet",
      fee: "0.00000",
      note: "Airdrop (mock)",
    },
  ]);
});

// --- payments routes ---


import { ethers } from "ethers";
console.log("Using RPC:", process.env.RPC_URL);

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

app.post("/pay/initiate", async (req, res) => {
  const { to, amount } = req.body;

  // basic validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
    return res.status(400).json({ ok: false, error: "Invalid recipient address" });
  }

  try {
    const value = ethers.parseEther(amount); // "0.1" → wei
    const tx = await signer.sendTransaction({ to, value });
    const receipt = await tx.wait();

    return res.json({
      ok: true,
      hash: tx.hash,
      block: receipt?.blockNumber,
      from: await signer.getAddress(),
      to,
      amount
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/pay/status", (_req, res) => {
  res.json({ txHash: "0xtest123...", status: "confirmed" });
});

// --- start server ---
app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});

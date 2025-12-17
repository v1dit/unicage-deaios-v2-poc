import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import crypto from "crypto"

dotenv.config()

const app = express()

// ----- middleware -----
app.use(cors())
app.use(express.json())

// ----- health check (RENDER NEEDS THIS) -----
app.get("/health", (_req, res) => {
	res.json({ status: "ok" })
})

// ----- demo endpoints -----

// Top-level demo transactions for frontend (avoid /api prefix for demo)
app.get("/transactions", (_req, res) => {
	res.json([
		{
			id: "tx_001",
			merchant: "Acme Corp",
			amount: 12450,
			currency: "USDC",
			status: "confirmed",
			timestamp: new Date().toISOString(),
		},
		{
			id: "tx_002",
			merchant: "Global Traders Ltd",
			amount: 8300,
			currency: "USDC",
			status: "confirmed",
			timestamp: new Date().toISOString(),
		},
	])
})

// Demo compliance insights
app.get("/insights", (_req, res) => {
	res.json({
		riskScore: 0.02,
		flags: [
			"Unusual transaction pattern detected in last 24 hours",
		],
		complianceStatus: "passed",
	})
})


// Create payment intent (NON-CUSTODIAL)
app.post("/api/payments", (req, res) => {
	const { amount, from, to, chain } = req.body

	if (!amount || !from || !to) {
		return res.status(400).json({ error: "Missing required fields" })
	}

	const tx = {
		id: crypto.randomUUID(),
		amount,
		from,
		to,
		chain: chain || "ethereum",
		status: "pending",
		createdAt: new Date().toISOString(),
		auditHash: crypto.randomUUID()
	}

	res.json(tx)
})

// List payments
app.get("/api/payments", (_req, res) => {
	res.json([
		{
			id: "tx_1",
			amount: 1250,
			status: "confirmed",
			chain: "ethereum"
		},
		{
			id: "tx_2",
			amount: 890,
			status: "pending",
			chain: "arbitrum"
		}
	])
})

// Reports endpoint
app.get("/api/reports", (_req, res) => {
	res.json({
		totalVolume: 147250.5,
		taxCollected: 14725.05,
		compliance: "verified"
	})
})

// ----- START SERVER -----
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
	console.log(`✅ Backend running on port ${PORT}`)
})

# Unicage Pay — Demo Backend

This repository contains the **demo backend for Unicage Pay**, a non-custodial USDC payments and compliance platform designed for regulated markets.

The backend demonstrates:
- Non-custodial payment flows
- Arbitrary wallet-to-wallet transactions
- Cryptographic audit hashing
- Regulator-ready reporting (CSV + report hash)
- A reproducible end-to-end demo flow (no gas required)

This is a **demo-mode system** intended to prove architecture, API shape, and auditability.  
Real on-chain execution is gated behind environment flags and is not enabled by default.

---

## What This Backend Proves

- **Non-custodial design**  
  Funds are never held, controlled, or executed by the platform. Wallet addresses are user-supplied.

- **Payment intent → audit trail**  
  Every payment produces:
  - a transaction hash (demo or real)
  - a per-transaction SHA-256 audit hash
  - inclusion in regulator-friendly reports

- **Persistence & reproducibility**  
  Transactions persist across restarts and can be re-exported at any time.

- **Production-ready semantics**  
  Demo mode mirrors production behavior without requiring gas, testnet tokens, or custody.

---

## Architecture Overview

**Key components:**
- Express + TypeScript backend
- `/api/payments` — create payment intents
- `/api/reports` — export CSV reports with hashes
- `/api/wallets` — demo wallet balance endpoint
- File-based persistence (`data/transactions.json`)
- Cryptographic hashing using SHA-256
- Lightweight integration smoke test

**Important:**  
This backend **does not**:
- Manage balances
- Custody funds
- Generate wallets
- Auto-execute or retry transactions
- Handle fiat

---

## Run Locally

### Prerequisites
- Node.js 18+
- npm

### Install
```bash
npm install

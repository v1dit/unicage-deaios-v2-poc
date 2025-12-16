# Unicage Pay — Demo Backend

Non-custodial USDC payments demo backend with:
- Arbitrary wallet addresses
- Demo-mode transaction submission
- Cryptographic audit hashes per transaction
- CSV reports with report-level SHA-256
- Lightweight integration smoke test

## Run locally

```bash
cd backend
npm install
npm run dev

# Smoke test
npm run smoke
```

Notes

- Demo mode only (no gas, no custody)
- Real-chain execution gated behind env flags
- Designed to support Base / Polygon / 0g later

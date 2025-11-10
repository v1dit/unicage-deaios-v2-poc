import express from "express";
export const router = express.Router();

router.get("/balance", (_, res) => {
  res.json({
    address: "0xmerchantDEMOaddress",
    balance: "100.00",
    network: "demo"
  });
});

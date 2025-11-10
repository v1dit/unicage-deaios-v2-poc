const express = require("express");
const cors = require("cors");
const { router: payments } = require("./routes/payments");
const { router: reports } = require("./routes/reports");
const { router: wallets } = require("./routes/wallets");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_: any, res: any) => {
	res.json({ ok: true, service: "unicage-deaios-v2-poc" });
});

app.use("/api/payments", payments);
app.use("/api/reports", reports);
app.use("/api/wallets", wallets);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

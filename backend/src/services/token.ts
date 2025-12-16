import { ethers } from "ethers";

// Minimal ERC20 ABI (USDC-compatible)
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const IS_REAL_CHAIN =
  !!process.env.RPC_URL &&
  !!process.env.PRIVATE_KEY &&
  !!process.env.USDC_CONTRACT;

export class TokenService {
  provider?: ethers.JsonRpcProvider;
  wallet?: ethers.Wallet;
  token?: ethers.Contract;

  constructor() {
    if (!IS_REAL_CHAIN) {
      console.log("[TokenService] Demo mode");
      console.log("[TokenService] PRIVATE_KEY length:", process.env.PRIVATE_KEY?.length);
      return;
    }

    if (!process.env.RPC_URL) throw new Error("Missing RPC_URL");
    if (!process.env.PRIVATE_KEY) throw new Error("Missing PRIVATE_KEY");
    if (!process.env.USDC_CONTRACT) throw new Error("Missing USDC_CONTRACT");

    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.token = new ethers.Contract(
      process.env.USDC_CONTRACT,
      ERC20_ABI,
      this.wallet
    );

    console.log("[TokenService] Real chain mode enabled");
      try {
        // ...some init that might throw
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.message.includes("private key")) {
            console.error("invalid private key detected");
          }
          console.error("token init err:", err.message);
        } else {
          console.error("token init err:", String(err));
        }
        throw err;
      }
  }

  async transfer(from: string | undefined, to: string, amount: string) {
    // For demo mode: deterministic fake hash, no signing
    if (!IS_REAL_CHAIN) {
  const payload = `${from || 'demo'}-${to}-${amount}-${Date.now()}`;
  const fakeHash = ethers.keccak256(ethers.toUtf8Bytes(payload));
      return {
        txHash: fakeHash,
        status: "demo"
      };
    }

    if (!this.token) throw new Error("Token contract not initialized");

    const value = ethers.parseUnits(amount, 6);
    const tx = await this.token.transfer(to, value);
    return { txHash: tx.hash, status: "submitted" };
  }

  async balanceOf(address?: string) {
    if (!IS_REAL_CHAIN) {
      return {
        address: "demo",
        balance: "1000",
        network: "demo"
      };
    }

    if (!this.token || !this.wallet) {
      throw new Error("TokenService not initialized");
    }

    const addr = address ?? this.wallet.address;
    const raw = await this.token.balanceOf(addr);

    return {
      address: addr,
      balance: ethers.formatUnits(raw, 6),
      network: "real"
    };
  }
}
export function getToken() {
  return 'token-placeholder';
}

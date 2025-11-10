import { ethers } from "ethers";

const ERC20_ABI = [
  "function transfer(address to,uint256 value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)"
];

export class TokenService {
  provider: ethers.JsonRpcProvider;
  wallet?: ethers.Wallet;
  token?: ethers.Contract;
  ready: boolean = false;

  constructor(rpcUrl: string, privateKey: string, tokenAddr: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl || "http://localhost:8545");
    try {
      if (privateKey && privateKey.length > 0 && tokenAddr) {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.token = new ethers.Contract(tokenAddr, ERC20_ABI, this.wallet);
        this.ready = true;
      } else {
        console.warn("TokenService initialized without private key or token address; functionality limited.");
      }
    } catch (err: any) {
      console.warn("TokenService wallet initialization failed:", err.message || err);
      this.ready = false;
    }
  }

  async transfer(to: string, amount: string) {
    if (!this.ready || !this.token) throw new Error("TokenService not initialized");
    const decimals = 6;
    const value = ethers.parseUnits(amount, decimals);
    const tx = await this.token.transfer(to, value);
    return tx.hash;
  }

  async getReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash);
  }

  async balanceOf(addr: string) {
    if (!this.ready || !this.token) throw new Error("TokenService not initialized");
    const b = await this.token.balanceOf(addr);
    return ethers.formatUnits(b, 6);
  }
}
export function getToken() {
  return 'token-placeholder';
}

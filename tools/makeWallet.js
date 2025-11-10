"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("viem/accounts");
const privateKey = (0, accounts_1.generatePrivateKey)(); // SAVE THIS SECRET SOMEWHERE SAFE. DO NOT COMMIT.
const account = (0, accounts_1.privateKeyToAccount)(privateKey);
console.log('ADDRESS:', account.address);
console.log('PRIVATE_KEY:', privateKey); // don't paste this anywhere public
//# sourceMappingURL=makeWallet.js.map
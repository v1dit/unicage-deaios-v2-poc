import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

const privateKey = generatePrivateKey(); // SAVE THIS SECRET SOMEWHERE SAFE. DO NOT COMMIT.
const account = privateKeyToAccount(privateKey);

console.log('ADDRESS:', account.address);
console.log('PRIVATE_KEY:', privateKey); // don't paste this anywhere public

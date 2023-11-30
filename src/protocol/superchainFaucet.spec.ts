import { Transaction } from '../types';
import { detectSuperchainFaucetTransaction } from './superchainFaucet';
import superchainFaucet0xd9dedf29 from '../test/transactions/superchainFaucet-0xd9dedf29.json';
import superchainFaucet0x443037b3 from '../test/transactions/superchainFaucet-0x443037b3.json';

describe('Superchain Faucet', () => {
  it('Should detect superchain faucet transaction', () => {
    const superchainFaucet1 = detectSuperchainFaucetTransaction(
      superchainFaucet0xd9dedf29 as Transaction,
    );
    expect(superchainFaucet1).toBe(true);

    const superchainFaucet2 = detectSuperchainFaucetTransaction(
      superchainFaucet0x443037b3 as Transaction,
    );
    expect(superchainFaucet2).toBe(true);
  });
});

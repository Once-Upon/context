import { Transaction } from '../types';
import { detectTokenAirdrop } from './tokenAirdrop';
import tokenAirdrop0x9559fbd9 from '../test-data/transactions/tokenAirdrop-0x9559fbd9.json';
import tokenAirdrop0xe2a9a20b from '../test-data/transactions/tokenAirdrop-0xe2a9a20b.json';
import tokenAirdrop0x4c7af9a2 from '../test-data/transactions/tokenAirdrop-0x4c7af9a2.json';
import tokenAirdrop0xb312ecc2 from '../test-data/transactions/tokenAirdrop-0xb312ecc2.json';

describe('Token Airdrop', () => {
  it('Should detect token airdrop transaction', () => {
    const tokenAirdrop1 = detectTokenAirdrop(
      tokenAirdrop0x9559fbd9 as Transaction,
    );
    expect(tokenAirdrop1).toBe(true);

    const tokenAirdrop2 = detectTokenAirdrop(
      tokenAirdrop0xe2a9a20b as Transaction,
    );
    expect(tokenAirdrop2).toBe(true);

    const tokenAirdrop3 = detectTokenAirdrop(
      tokenAirdrop0x4c7af9a2 as Transaction,
    );
    expect(tokenAirdrop3).toBe(true);

    const tokenAirdrop4 = detectTokenAirdrop(
      tokenAirdrop0xb312ecc2 as Transaction,
    );
    expect(tokenAirdrop4).toBe(true);
  });
});

import { Transaction } from '../../types';
import { detect } from './tokenAirdrop';
import tokenAirdrop0x9559fbd9 from '../../test/transactions/tokenAirdrop-0x9559fbd9.json';
import tokenAirdrop0xe2a9a20b from '../../test/transactions/tokenAirdrop-0xe2a9a20b.json';
import tokenAirdrop0xb312ecc2 from '../../test/transactions/tokenAirdrop-0xb312ecc2.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Token Airdrop', () => {
  it('Should detect token airdrop transaction', () => {
    const tokenAirdrop1 = detect(tokenAirdrop0x9559fbd9 as Transaction);
    expect(tokenAirdrop1).toBe(true);

    const tokenAirdrop2 = detect(tokenAirdrop0xe2a9a20b as Transaction);
    expect(tokenAirdrop2).toBe(true);

    const tokenAirdrop3 = detect(tokenAirdrop0xb312ecc2 as Transaction);
    expect(tokenAirdrop3).toBe(true);
  });

  it('Should not detect token airdrop transaction', () => {
    const tokenAirdrop1 = detect(catchall0xc35c01ac as Transaction);
    expect(tokenAirdrop1).toBe(false);
  });
});

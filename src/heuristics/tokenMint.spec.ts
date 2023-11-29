import { Transaction } from '../types';
import { detectTokenMint } from './tokenMint';
import tokenMint0x2c8a3ed1 from '../test/transactions/tokenMint-0x2c8a3ed1.json';
import tokenMint0x45d1ed7b from '../test/transactions/tokenMint-0x45d1ed7b.json';
import tokenMint0x35f54999 from '../test/transactions/tokenMint-0x35f54999.json';
import erc20Swap0xd55dc9b2 from '../test/transactions/erc20Swap-0xd55dc9b2.json';

describe('Token Mint', () => {
  it('Should detect token mint transaction', () => {
    const tokenMint1 = detectTokenMint(tokenMint0x2c8a3ed1 as Transaction);
    expect(tokenMint1).toBe(true);

    const tokenMint2 = detectTokenMint(tokenMint0x45d1ed7b as Transaction);
    expect(tokenMint2).toBe(true);

    const tokenMint3 = detectTokenMint(tokenMint0x35f54999 as Transaction);
    expect(tokenMint3).toBe(true);
  });

  it('Should not detect as TokenMint', () => {
    const isTokenMint1 = detectTokenMint(erc20Swap0xd55dc9b2 as Transaction);
    expect(isTokenMint1).toBe(false);
  });
});

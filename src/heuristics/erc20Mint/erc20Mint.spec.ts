import { Transaction } from '../../types';
import { detect } from './erc20Mint';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import erc20Mint0x5bc8b9a8 from '../../test/transactions/erc20Mint-0x5bc8b9a8.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC20 Mint', () => {
  it('Should detect ERC20 Mint transaction', () => {
    const isTokenMint1 = detect(erc20Mint0x5bc8b9a8 as Transaction);
    expect(isTokenMint1).toBe(true);
  });

  it('Should not detect as ERC20 Mint', () => {
    const isTokenMint1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isTokenMint1).toBe(false);

    const isTokenMint2 = detect(catchall0xc35c01ac as Transaction);
    expect(isTokenMint2).toBe(false);
  });

  it('Should generate a context for ERC20 Mint', () => {});
});

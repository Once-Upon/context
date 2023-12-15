import { Transaction } from '../../types';
import { detect, generate } from './tokenMint';
import tokenMint0x2c8a3ed1 from '../../test/transactions/tokenMint-0x2c8a3ed1.json';
import tokenMint0x45d1ed7b from '../../test/transactions/tokenMint-0x45d1ed7b.json';
import tokenMint0x35f54999 from '../../test/transactions/tokenMint-0x35f54999.json';
import erc721Mint0x02e0551e from '../../test/transactions/erc721Mint-0x02e0551e.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Token Mint', () => {
  it('Should detect token mint transaction', () => {
    const tokenMint1 = detect(tokenMint0x2c8a3ed1 as Transaction);
    expect(tokenMint1).toBe(true);

    const tokenMint2 = detect(tokenMint0x45d1ed7b as Transaction);
    expect(tokenMint2).toBe(true);

    const tokenMint3 = detect(tokenMint0x35f54999 as Transaction);
    expect(tokenMint3).toBe(true);

    const tokenMint4 = detect(erc721Mint0x02e0551e as Transaction);
    expect(tokenMint4).toBe(true);
  });

  it('Should not detect as TokenMint', () => {
    const isTokenMint1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isTokenMint1).toBe(false);

    const isTokenMint2 = detect(catchall0xc35c01ac as Transaction);
    expect(isTokenMint2).toBe(false);
  });

  it('Should generate a context for token mint', () => {
    const tokenMint1 = generate(erc721Mint0x02e0551e as Transaction);
    expect(tokenMint1.context.summaries.category).toBe('NFT');
    const desc1 = contextSummary(tokenMint1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 MINTED 10 x 0x251c3246642dbcc5473ae8700a14a11522a4302c #105 for 0.1 ETH',
    );
  });
});

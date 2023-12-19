import { Transaction } from '../../types';
import { detect, generate } from './erc20Mint';
import { contextSummary } from '../../helpers/utils';
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

  it('Should generate a context for ERC20 Mint', () => {
    const tokenMint1 = generate(erc20Mint0x5bc8b9a8 as Transaction);
    expect(tokenMint1.context.summaries.en.title).toBe('ERC20 Mint');
    const desc1 = contextSummary(tokenMint1.context);
    expect(desc1).toBe(
      '0x72b000b693ea3c16650fe8a2eae15402aaf76e57 MINTED 53868290929609838780 0xdbc3a41578bbfa47837a9cd8196a5bc7f44c8041 for 0 ETH',
    );
  });
});

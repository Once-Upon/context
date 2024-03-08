import { Transaction } from '../../types';
import { detect, generate } from './enjoy';
import enjoyAddLiquidity0x5005b386 from '../../test/transactions/enjoyAddLiquidity-0x5005b386.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Enjoy', () => {
  it('Should detect enjoy', () => {
    const enjoy1 = detect(enjoyAddLiquidity0x5005b386 as Transaction);
    expect(enjoy1).toBe(true);
  });

  it('Should generate context for enjoy add liquidity', () => {
    const enjoy1 = generate(enjoyAddLiquidity0x5005b386 as Transaction);
    console.log('enjoy1', enjoy1.context);
    expect(enjoy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(enjoy1.context?.summaries?.en.title).toBe('Uniswap');
    const desc1 = contextSummary(enjoy1.context);
    expect(desc1).toBe(
      '0x6b3210caa59c0367edc0b0e60636db02a623ce58 ADDED_LIQUIDITY with 0.022175029426293734 ETH ETH and 1862664875000000000000000 0xa6b280b42cb0b7c4a4f789ec6ccc3a7609a1bc39',
    );
  });

  it('Should not detect as enjoy', () => {
    const enjoy1 = detect(catchall0xc35c01ac as Transaction);
    expect(enjoy1).toBe(false);
  });
});

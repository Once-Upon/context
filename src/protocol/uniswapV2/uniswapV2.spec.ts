import { Transaction } from '../../types';
import { detect, generate } from './uniswapV2';
import enjoyAddLiquidity0x5005b386 from '../../test/transactions/enjoyAddLiquidity-0x5005b386.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../helpers/utils';

describe('Uniswap', () => {
  it('Should detect enjoy addLiquidityETH', () => {
    const enjoy1 = detect(
      enjoyAddLiquidity0x5005b386 as unknown as Transaction,
    );
    expect(enjoy1).toBe(true);
  });

  it('Should generate context for enjoy addLiquidityETH', () => {
    const enjoy1 = generate(
      enjoyAddLiquidity0x5005b386 as unknown as Transaction,
    );
    expect(enjoy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(enjoy1.context?.summaries?.en.title).toBe('Uniswap');
    const desc1 = contextSummary(enjoy1.context);
    expect(desc1).toBe(
      '0x6b3210caa59c0367edc0b0e60636db02a623ce58 ADDED_LIQUIDITY with 0.022175029426293734 ETH and 1862664875000000000000000 0xa6b280b42cb0b7c4a4f789ec6ccc3a7609a1bc39',
    );
    expect(containsBigInt(enjoy1.context)).toBe(false);
  });

  it('Should not detect as UniswapV2 with Enjoy token', () => {
    const enjoy1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(enjoy1).toBe(false);
  });
});

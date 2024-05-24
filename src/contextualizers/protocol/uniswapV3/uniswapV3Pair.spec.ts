import { Transaction } from '../../../types';
import { detect, generate } from './uniswapV3Pair';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import uniswapV30xc5a57ee5 from '../../test/transactions/uniswapV3-0xc5a57ee5.json';
import uniswapV3Pair0x6953c36b from '../../test/transactions/uniswapV3Pair-0x6953c36b.json';
import uniswapV3Pair0xcc883774 from '../../test/transactions/uniswapV3Pair-0xcc883774.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Uniswap', () => {
  it('Should detect uniswap v3 swap', () => {
    const swap1 = detect(uniswapV30xc5a57ee5 as unknown as Transaction);
    expect(swap1).toBe(true);

    const swap2 = detect(uniswapV3Pair0x6953c36b as unknown as Transaction);
    expect(swap2).toBe(true);

    const swap3 = detect(uniswapV3Pair0xcc883774 as unknown as Transaction);
    expect(swap3).toBe(true);
  });

  it('Should generate context for uniswap v3 swap', () => {
    const swap1 = generate(uniswapV30xc5a57ee5 as unknown as Transaction);
    expect(swap1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(swap1.context?.summaries?.en.title).toBe('Uniswap');
    const desc1 = contextSummary(swap1.context);
    expect(desc1).toBe(
      '0xf70da97812cb96acdf810712aa562db8dfa3dbef swapped 0.00141259557240223 ETH for 1372743836828975471 0x4200000000000000000000000000000000000042',
    );
    expect(containsBigInt(swap1.context)).toBe(false);

    // const swap2 = generate(uniswapV3Pair0x6953c36b as unknown as Transaction);
    // expect(swap2.context?.summaries?.category).toBe('PROTOCOL_1');
    // expect(swap2.context?.summaries?.en.title).toBe('Uniswap');
    // const desc2 = contextSummary(swap2.context);
    // expect(desc2).toBe(
    //   '0x6f1cdbbb4d53d226cf4b917bf768b94acbab6168 swapped 56625778127422422604 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 for 198805648076 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    // );
    // expect(containsBigInt(swap2.context)).toBe(false);

    const swap3 = generate(uniswapV3Pair0xcc883774 as unknown as Transaction);
    expect(swap3.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(swap3.context?.summaries?.en.title).toBe('Uniswap');
    const desc3 = contextSummary(swap3.context);
    expect(desc3).toBe(
      '0x1e474b50bdc2b39dccaa2b8ddf37b3f022b128a8 SWAPPED 0.05 ETH for 9670369113186014800347 0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    );
    expect(containsBigInt(swap3.context)).toBe(false);
  });

  it('Should not detect as UniswapV3', () => {
    const catchall1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(catchall1).toBe(false);
  });
});

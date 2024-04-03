import { Transaction } from '../../../types';
import { detect, generate } from './uniswapV3Pair';
import uniswapV30xc5a57ee5 from '../../test/transactions/uniswapV3-0xc5a57ee5.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../../helpers/utils';

describe('Uniswap', () => {
  it('Should detect uniswap v3 swap', () => {
    const swap1 = detect(uniswapV30xc5a57ee5 as unknown as Transaction);
    expect(swap1).toBe(true);
  });

  it('Should generate context for uniswap v3 swap', () => {
    const enjoy1 = generate(uniswapV30xc5a57ee5 as unknown as Transaction);
    expect(enjoy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(enjoy1.context?.summaries?.en.title).toBe('Uniswap');
    const desc1 = contextSummary(enjoy1.context);
    expect(desc1).toBe(
      '0xcb1355ff08ab38bbce60111f1bb2b784be25d7e8 swapped 1412595572402230 0x4200000000000000000000000000000000000006 for 1372743836828975471 0x4200000000000000000000000000000000000042',
    );
    expect(containsBigInt(enjoy1.context)).toBe(false);
  });

  it('Should not detect as UniswapV3', () => {
    const enjoy1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(enjoy1).toBe(false);
  });
});

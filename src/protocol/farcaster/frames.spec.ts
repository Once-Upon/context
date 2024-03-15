import { Transaction } from '../../types';
import { detect, generate } from './frames';
import farcasterFrame0x9d360869 from '../../test/transactions/farcasterFrame-0x9d360869.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../helpers/utils';

describe('Disperse', () => {
  it('Should detect disperse transaction', () => {
    const disperse1 = detect(farcasterFrame0x9d360869 as Transaction);
    expect(disperse1).toBe(true);
  });

  it('Should generate context for disperseEth transaction', () => {
    const disperse1 = generate(farcasterFrame0x9d360869 as Transaction);
    expect(disperse1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(disperse1.context?.summaries?.en.title).toBe('Warpcast');
    const desc1 = contextSummary(disperse1.context);
    expect(desc1).toBe('Warpcast');
    expect(containsBigInt(disperse1.context)).toBe(false);
  });

  it('Should not detect as disperseEth', () => {
    const disperse1 = detect(catchall0xc35c01ac as Transaction);
    expect(disperse1).toBe(false);
  });
});

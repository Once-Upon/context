import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import starGateDestination0x560feb53 from '../../test/transactions/starGateDestination-0x560feb53.json';
import starGateDestination0x055e99bf from '../../test/transactions/starGateDestination-0x055e99bf.json';
import starGateDestination0x9995cec4 from '../../test/transactions/starGateDestination-0x9995cec4.json';

describe('StarGate Destination', () => {
  it('Should detect transaction', () => {
    const isStarGateDestination1 = detect(
      starGateDestination0x560feb53 as unknown as Transaction,
    );
    expect(isStarGateDestination1).toBe(true);

    const isStarGateDestination2 = detect(
      starGateDestination0x055e99bf as unknown as Transaction,
    );
    expect(isStarGateDestination2).toBe(true);

    const isStarGateDestination3 = detect(
      starGateDestination0x9995cec4 as unknown as Transaction,
    );
    expect(isStarGateDestination3).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      starGateDestination0x560feb53 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0xe93685f3bba03016f02bd1828badd6195988d950 BRIDGED 0.021045118451890345 ETH from 42161',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      starGateDestination0x055e99bf as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0xe93685f3bba03016f02bd1828badd6195988d950 BRIDGED 295468582 0xdac17f958d2ee523a2206206994597c13d831ec7 from 56',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      starGateDestination0x9995cec4 as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction3.context)).toBe(
      '0xe93685f3bba03016f02bd1828badd6195988d950 BRIDGED 0.049956406385844893 ETH from 10',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);
  });
});

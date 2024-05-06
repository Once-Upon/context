import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldSource0x3374f5f4 from '../../test/transactions/goldSource-0x3374f5f4.json';
import goldSource0xef715998 from '../../test/transactions/goldSource-0xef715998.json';

describe('Gold Source', () => {
  it('Should detect transaction', () => {
    const isGoldSource1 = detect(
      goldSource0x3374f5f4 as unknown as Transaction,
    );
    expect(isGoldSource1).toBe(true);

    const isGoldSource2 = detect(
      goldSource0xef715998 as unknown as Transaction,
    );
    expect(isGoldSource2).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      goldSource0x3374f5f4 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Gold');
    expect(contextSummary(transaction1.context)).toBe(
      '0xB374FDD2951A65e827Dab88f692a6819dc43c6D7 ACTIVATED_A_STARTER_PACK',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      goldSource0xef715998 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Gold');
    expect(contextSummary(transaction2.context)).toBe(
      '0x18F33CEf45817C428d98C4E188A770191fDD4B79 ACTIVATED_A_STARTER_PACK',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

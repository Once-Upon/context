import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldSource0x31893393 from '../../test/transactions/goldSource-0x31893393.json';

describe('Skyoneer Source', () => {
  it('Should detect transaction', () => {
    const isSkyoneerSource1 = detect(
      goldSource0x31893393 as unknown as Transaction,
    );
    expect(isSkyoneerSource1).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      goldSource0x31893393 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Skyoneer');
    expect(contextSummary(transaction1.context)).toBe(
      '0x9a37e57d177c5ff8817b55da36f2a2b3532cde3f ACTIVATED_A_STARTER_PACK',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);
  });
});

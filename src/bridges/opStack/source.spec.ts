import { Transaction } from '../../types';
import { detect, generate } from './source';
import { contextSummary } from '../../helpers/utils';
import optimismSource0x8a83b7b4 from '../../test/transactions/optimism-source-0x8a83b7b4.json';
import hopSource0x8603ffab from '../../test/transactions/hop-source-0x8603ffab.json';

describe('Optimism Source', () => {
  it('Should detect transaction', () => {
    const isOptimismSource1 = detect(optimismSource0x8a83b7b4 as Transaction);
    expect(isOptimismSource1).toBe(true);

    const isOptimismSource2 = detect(hopSource0x8603ffab as Transaction);
    expect(isOptimismSource2).toBe(false);
  });

  it('Should generate context', () => {
    const transaction = generate(optimismSource0x8a83b7b4 as Transaction);
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH to 10 resulting in 0x2563ad7929d8efa2e4d00c865cdb9090d8fbcd4ebc50ac85db61123b21ea476c',
    );
  });
});

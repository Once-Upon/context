import { Transaction } from '../../types';
import { detect, generate } from './source';
import { contextSummary } from '../../helpers/utils';
import baseSource0x8a83b7b4 from '../../test/transactions/base-source-0x8a83b7b4.json';
import optimismSource0x992b053b from '../../test/transactions/optimism-source-0x992b053b.json';
import baseBridge0xce910123 from '../../test/transactions/baseBridge-0xce910123.json';
import hopSource0x8603ffab from '../../test/transactions/hop-source-0x8603ffab.json';

describe('Optimism Source', () => {
  it('Should detect transaction', () => {
    const isOptimismSource1 = detect(
      baseSource0x8a83b7b4 as unknown as Transaction,
    );
    expect(isOptimismSource1).toBe(true);

    const isOptimismSource2 = detect(
      hopSource0x8603ffab as unknown as Transaction,
    );
    expect(isOptimismSource2).toBe(false);

    const isOptimismSource3 = detect(
      baseBridge0xce910123 as unknown as Transaction,
    );
    expect(isOptimismSource3).toBe(true);

    const isOptimismSource4 = detect(
      optimismSource0x992b053b as unknown as Transaction,
    );
    expect(isOptimismSource4).toBe(true);
  });

  it('Should generate context', () => {
    const baseTransaction1 = generate(
      baseSource0x8a83b7b4 as unknown as Transaction,
    );
    expect(baseTransaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(baseTransaction1.context)).toBe(
      '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH to 8453 resulting in 0x2563ad7929d8efa2e4d00c865cdb9090d8fbcd4ebc50ac85db61123b21ea476c',
    );

    const optimismTransaction1 = generate(
      optimismSource0x992b053b as unknown as Transaction,
    );
    expect(optimismTransaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(optimismTransaction1.context)).toBe(
      '0xf64da4efa19b42ef2f897a3d533294b892e6d99e BRIDGED 0.2 ETH to 10 resulting in 0xafb3520859949d9c14912f93f17ec57b362295ad9d793c20fe4f0ceea38e3010',
    );
  });
});

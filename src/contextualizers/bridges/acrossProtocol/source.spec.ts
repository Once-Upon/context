import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { contextSummary } from '../../../helpers/utils';
import acrossProtocolBaseEth0xfc9a2f83 from '../../test/transactions/across-protocol-base-eth-0xfc9a2f83.json';

describe('Across Protocol Source', () => {
  it('Should detect transaction', () => {
    const isAcrossProtocolSource1 = detect(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(isAcrossProtocolSource1).toBe(true);
  });

  it('Should generate context', () => {
    const baseTransaction1 = generate(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(baseTransaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(baseTransaction1.context)).toBe(
      '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH to 8453 resulting in 0x2563ad7929d8efa2e4d00c865cdb9090d8fbcd4ebc50ac85db61123b21ea476c',
    );
  });
});

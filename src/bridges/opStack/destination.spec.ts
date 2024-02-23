import { Transaction } from '../../types';
import { detect, generate } from './destination';
import { contextSummary } from '../../helpers/utils';
import optimismDestination0x2563476c from '../../test/transactions/optimism-destination-0x2563476c.json';

describe('EAS', () => {
  describe('attest', () => {
    it('Should detect transaction', () => {
      const isOptimismDestination = detect(
        optimismDestination0x2563476c as Transaction,
      );
      expect(isOptimismDestination).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        optimismDestination0x2563476c as Transaction,
      );
      console.log(
        'transaction',
        transaction.netAssetTransfers,
        transaction.context,
      );
      expect(transaction.context?.summaries?.en.title).toBe('Bridge');
      expect(contextSummary(transaction.context)).toBe(
        '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH from 1',
      );
    });
  });
});

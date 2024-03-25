import { transform } from './delegateCalls';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionDelegateCalls', () => {
  it('should return delegate calls', () => {
    const block = loadBlockFixture('ethereum', 14573289);
    const result = transform(block);

    const resultTxHashes = result.transactions.map((r) => r.hash);

    for (const tx of block.transactions) {
      const idx = resultTxHashes.indexOf(tx.hash);
      if (idx < 0) {
        continue;
      }

      expect(result.transactions[idx].delegateCalls).toStrictEqual(
        tx.traces.filter((t) => t.action.callType === 'delegatecall'),
      );
    }
  });
});

import { transform as _transform } from './delegateCalls';
import { loadBlockFixture } from '../helpers/dev';
import { makeTransform } from '../../helpers/utils';

const transform = makeTransform({ test: _transform });

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

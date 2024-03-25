import { transform } from './timestamp';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionTimestamp', () => {
  it('should return transaction timestamp', () => {
    const block = loadBlockFixture('ethereum', 14573289);
    const result = transform(block);

    for (let i = 0; i < block.transactions.length; i += 1) {
      expect(result.transactions[i].timestamp).toBe(block.timestamp);
    }
  });
});

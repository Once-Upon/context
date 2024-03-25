import { transform } from './errors';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionErrors', () => {
  it('should return transaction errors', () => {
    const block = loadBlockFixture('ethereum', 14918216);
    const result = transform(block);

    const errors: string[] = result.transactions.map((tx) => tx.errors).flat();
    expect(errors.length).toBe(6);
    expect(errors.every((e) => e.length > 0)).toBe(true);
  });
});

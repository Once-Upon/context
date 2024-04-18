import { transform as _transform } from './derivativesNeighbors';
import { loadBlockFixture } from '../helpers/dev';
import { makeTransform } from '../../helpers/utils';

const transform = makeTransform({ test: _transform });

describe('transactionDerivativesNeighbors', () => {
  it('should return derivatives neighbors', () => {
    const testBlock = loadBlockFixture('ethereum', 13533772);
    const testBlockResults = transform(testBlock);

    testBlockResults.transactions.forEach((tx) => {
      // TODO - assert here
    });
  });
});

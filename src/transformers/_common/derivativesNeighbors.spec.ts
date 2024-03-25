import { transform } from './derivativesNeighbors';
import { loadBlockFixture } from '../../helpers/utils';

describe('transactionDerivativesNeighbors', () => {
  it('should return derivatives neighbors', () => {
    const testBlock = loadBlockFixture('ethereum', 13533772);
    const testBlockResults = transform(testBlock);

    testBlockResults.transactions.forEach((tx) => {
      // TODO - assert here
    });
  });
});

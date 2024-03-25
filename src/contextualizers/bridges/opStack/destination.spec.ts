import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary } from '../../../helpers/utils';
import optimismDestination0x2563476c from '../../test/transactions/optimism-destination-0x2563476c.json';
import hopDestination0x0902ccb6 from '../../test/transactions/hop-destination-0x0902ccb6.json';

describe('Optimism Destination', () => {
  it('Should detect transaction', () => {
    const isOptimismDestination1 = detect(
      optimismDestination0x2563476c as Transaction,
    );
    expect(isOptimismDestination1).toBe(true);

    const isOptimismDestination2 = detect(
      hopDestination0x0902ccb6 as Transaction,
    );
    expect(isOptimismDestination2).toBe(false);
  });

  it('Should generate context', () => {
    const transaction = generate(optimismDestination0x2563476c as Transaction);
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH from 1',
    );
  });
});

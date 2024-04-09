import { Transaction } from '../../../types';
import { detect } from './highlight';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Highlight', () => {
  it('Should not detect as highlight', () => {
    const zoraMintWithRewards1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(zoraMintWithRewards1).toBe(false);
  });
});

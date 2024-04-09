import { Transaction } from '../../../types';
import { detect } from './highlight';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Highlight', () => {
  it('Should not detect as highlight', () => {
    const highlightMintWithRewards1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(highlightMintWithRewards1).toBe(false);
  });
});

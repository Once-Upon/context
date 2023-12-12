import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { detect, generate } from './foundation';
import foundationPlaceBidV20x86c62822 from '../../test/transactions/foundation-place-bid-v2-0x86c62822.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Foundation', () => {
  it('Should detect Foundation transaction', () => {
    const foundation1 = detect(foundationPlaceBidV20x86c62822 as Transaction);
    expect(foundation1).toBe(true);
  });

  it('Should generate Foundation context', () => {
    const foundation1 = generate(foundationPlaceBidV20x86c62822 as Transaction);
    const desc1 = contextSummary(foundation1.context);
    expect(desc1).toBe(
      '0x5d7dcb9f59d4e1cf96463a72e866966149df1552 PLACED_BID on auction 224399',
    );
  });

  it('Should not detect as Foundation', () => {
    const leeroy1 = detect(catchall0xc35c01ac as Transaction);
    expect(leeroy1).toBe(false);
  });
});

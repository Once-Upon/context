import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { detect, generate } from './friendTech';
import friendTech0xde5ce243 from '../../test/transactions/friendTech-0xde5ce243.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('FriendTech', () => {
  it('Should detect FriendTech transaction', () => {
    const friendTech1 = detect(friendTech0xde5ce243 as Transaction);
    expect(friendTech1).toBe(true);
  });

  it('Should not detect as FriendTech', () => {
    const friendTech1 = detect(catchall0xc35c01ac as Transaction);
    expect(friendTech1).toBe(false);
  });

  it('Should generate FriendTech context', () => {
    const friendTech1 = generate(friendTech0xde5ce243 as Transaction);
    const desc1 = contextSummary(friendTech1.context);
    expect(desc1).toBe('YOUR_DESCRIPTION_HERE');
  });
});

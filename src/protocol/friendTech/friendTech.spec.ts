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
    expect(desc1).toBe(
      '0x306dd2B26F1383c62925F58151263D9E5656E86E BOUGHT_KEYS of 0xD6820270E904A5E4527d765afF9534f07E55d2BD for 0.004 ETH',
    );
  });
});

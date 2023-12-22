import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { generate } from './friendTech';
import { detect } from './detect';
import friendTech0xde5ce243 from '../../test/transactions/friendTech-0xde5ce243.json';
import friendTech0xe65b4bd6 from '../../test/transactions/friendTech-0xe65b4bd6.json';
import friendTech0xed2dd79e from '../../test/transactions/friendTech-0xed2dd79e.json';
import friendTech0x703647d1 from '../../test/transactions/friendTech-0x703647d1.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('FriendTech', () => {
  it('Should detect FriendTech transaction', () => {
    const friendTech1 = detect(friendTech0xde5ce243 as Transaction);
    expect(friendTech1).toBe(true);

    const friendTech2 = detect(friendTech0xe65b4bd6 as Transaction);
    expect(friendTech2).toBe(true);

    const friendTech3 = detect(friendTech0xed2dd79e as Transaction);
    expect(friendTech3).toBe(true);

    const friendTech4 = detect(friendTech0x703647d1 as Transaction);
    expect(friendTech4).toBe(true);
  });

  it('Should not detect as FriendTech', () => {
    const friendTech1 = detect(catchall0xc35c01ac as Transaction);
    expect(friendTech1).toBe(false);
  });

  it('Should generate FriendTech context', () => {
    const friendTech1 = generate(friendTech0xde5ce243 as Transaction);
    const desc1 = contextSummary(friendTech1.context);
    expect(desc1).toBe(
      '0x306dd2B26F1383c62925F58151263D9E5656E86E BOUGHT_KEYS 1 key of 0xD6820270E904A5E4527d765afF9534f07E55d2BD for 0.004 ETH',
    );

    const friendTech2 = generate(friendTech0xe65b4bd6 as Transaction);
    const desc2 = contextSummary(friendTech2.context);
    expect(desc2).toBe(
      '0x3cf97bE80B4A80a933b93E759D7619E36e80a076 SOLD_KEYS 1 key of 0x3cf97bE80B4A80a933b93E759D7619E36e80a076 for 0.0050625 ETH',
    );

    const friendTech3 = generate(friendTech0xed2dd79e as Transaction);
    const desc3 = contextSummary(friendTech3.context);
    expect(desc3).toBe(
      '0x61a562de165e078ac4e06150c7c025d1e81f8fa0 FAILED_TO_BUY_KEYS 1 key of 0x72dE51dd1954a0ef37143a9892B230FD4F59A4B6 for 0.00006875 ETH',
    );

    const friendTech4 = generate(friendTech0x703647d1 as Transaction);
    const desc4 = contextSummary(friendTech4.context);
    expect(desc4).toBe('0x72dE51dd1954a0ef37143a9892B230FD4F59A4B6 SIGNED_UP');
  });
});

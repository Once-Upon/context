import { Transaction } from '../../types';
import { detect } from './superchainFaucet';
import superchainFaucet0xd9dedf29 from '../../test/transactions/superchainFaucet-0xd9dedf29.json';
import superchainFaucet0x443037b3 from '../../test/transactions/superchainFaucet-0x443037b3.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Superchain Faucet', () => {
  it('Should detect superchain faucet transaction', () => {
    const superchainFaucet1 = detect(superchainFaucet0xd9dedf29 as Transaction);
    expect(superchainFaucet1).toBe(true);

    const superchainFaucet2 = detect(superchainFaucet0x443037b3 as Transaction);
    expect(superchainFaucet2).toBe(true);
  });

  it('Should not detect as superchain faucet', () => {
    const superchainFaucet1 = detect(catchall0xc35c01ac as Transaction);
    expect(superchainFaucet1).toBe(false);
  });
});

import { Transaction } from '../../types';
import { detectReverseENS } from './reverse';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ENS Reverse', () => {
  it('Should not detect as ens reverse', () => {
    const ensReverse1 = detectReverseENS(catchall0xc35c01ac as Transaction);
    expect(ensReverse1).toBe(false);
  });
});

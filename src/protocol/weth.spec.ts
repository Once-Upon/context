import { Transaction } from '../types';
import { detectWeth } from './weth';
import catchall0xc35c01ac from '../test/transactions/catchall-0xc35c01ac.json';

describe('Weth', () => {
  it('Should not detect as weth', () => {
    const weth1 = detectWeth(catchall0xc35c01ac as Transaction);
    expect(weth1).toBe(false);
  });
});

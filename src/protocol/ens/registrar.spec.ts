import { Transaction } from '../../types';
import { detectENS } from './registrar';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ENS Registrar', () => {
  it('Should not detect as ens registrar', () => {
    const ensRegistrar1 = detectENS(catchall0xc35c01ac as Transaction);
    expect(ensRegistrar1).toBe(false);
  });
});

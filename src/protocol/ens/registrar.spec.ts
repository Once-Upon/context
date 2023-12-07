import { Transaction } from '../../types';
import { detectENS } from './registrar';
import ens0xdb203e93 from '../../test/transactions/ens-0xdb203e93.json';
import ens0xea1b4ab6 from '../../test/transactions/ens-0xea1b4ab6.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ENS Registrar', () => {
  it('Should detect ens registrar', () => {
    const ensRegistrar1 = detectENS(ens0xdb203e93 as Transaction);
    expect(ensRegistrar1).toBe(true);

    const ensRegistrar2 = detectENS(ens0xea1b4ab6 as Transaction);
    expect(ensRegistrar2).toBe(true);
  });

  it('Should not detect as ens registrar', () => {
    const ensRegistrar1 = detectENS(catchall0xc35c01ac as Transaction);
    expect(ensRegistrar1).toBe(false);
  });
});

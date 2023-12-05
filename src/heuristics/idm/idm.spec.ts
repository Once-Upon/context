import { Transaction } from '../../types';
import { detectIdm } from './idm';
import idm0xf07ff1ad from '../../test/transactions/idm-0xf07ff1ad.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Input Data Message', () => {
  it('Should detect idm transaction', () => {
    const idm1 = detectIdm(idm0xf07ff1ad as Transaction);
    expect(idm1).toBe(true);
  });

  it('Should not detect idm transaction', () => {
    const idm1 = detectIdm(catchall0xc35c01ac as Transaction);
    expect(idm1).toBe(false);
  });
});

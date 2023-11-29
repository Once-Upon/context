import { Transaction } from '../types';
import { detectIdm } from './idm';
import idm0xf07ff1ad from '../test-data/transactions/idm-0xf07ff1ad.json';

describe('Input Data Message', () => {
  it('Should detect idm transaction', () => {
    const idm1 = detectIdm(idm0xf07ff1ad as Transaction);
    expect(idm1).toBe(true);
  });
});

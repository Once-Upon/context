import { Transaction } from '../../../types';
import { contextSummary } from '../../../helpers/utils';
import { detect, generate } from './registrar';
import bnsRegistrar0x7f1eeb75 from '../../test/transactions/bns-registrar-0x7f1eeb75.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('BNS Registrar', () => {
  it('Should detect bns registrar transaction', () => {
    const bns1 = detect(bnsRegistrar0x7f1eeb75 as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should not detect as bns registrar transaction', () => {
    const bns1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(bns1).toBe(false);
  });

  it('Should generate bns context', () => {
    const bns1 = generate(bnsRegistrar0x7f1eeb75 as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0xf20d84df17a8c56244e1a9d4844bef2386eece84 REGISTERED boger.base for 365 days',
    );
  });
});

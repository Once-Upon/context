import { Transaction } from '../../../types';
import { detect, generate } from './reverse';
import { contextSummary } from '../../../helpers/utils';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import bnsSetName0x3153ad22 from '../../test/transactions/bns-set-name-0x3153ad22.json';

describe('BNS Reverse', () => {
  it('Should not detect as bns reverse', () => {
    const bnsReverse = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(bnsReverse).toBe(false);
  });

  it('Should generate bns reverse context', () => {
    const bns1 = generate(bnsSetName0x3153ad22 as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0xe6a708592741fea6e32833a1ff65f9d15b7aa636 SET_REVERSE_BNS_TO navator144.base',
    );
  });
});

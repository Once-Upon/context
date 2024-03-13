import { Transaction } from '../../types';
import { detect, generate } from './disperse';
import disperse0x6fcb3def from '../../test/transactions/disperse-0x6fcb3def.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../helpers/utils';

describe('Disperse', () => {
  it('Should detect disperse transaction', () => {
    const disperse1 = detect(disperse0x6fcb3def as Transaction);
    expect(disperse1).toBe(true);
  });

  it('Should generate context for disperseEth transaction', () => {
    const disperse1 = generate(disperse0x6fcb3def as Transaction);
    expect(disperse1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(disperse1.context?.summaries?.en.title).toBe('Disperse');
    const desc1 = contextSummary(disperse1.context);
    expect(desc1).toBe(
      '0x0de290f9717764641b9694c246338a477cff9543 TIPPED 0x3e6c23cdaa52b1b6621dbb30c367d16ace21f760 0.0009 ETH',
    );
    expect(containsBigInt(disperse1.context)).toBe(false);
  });

  it('Should not detect as disperseEth', () => {
    const disperse1 = detect(catchall0xc35c01ac as Transaction);
    expect(disperse1).toBe(false);
  });
});

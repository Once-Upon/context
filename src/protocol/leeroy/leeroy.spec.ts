import { Transaction } from '../../types';
import { detect, generate } from './leeroy';
import leeroy0x9c6d7a1a from '../../test/transactions/leeroy-0x9c6d7a1a.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Leeroy', () => {
  it('Should detect leeroy', () => {
    const leeroy1 = detect(leeroy0x9c6d7a1a as Transaction);
    expect(leeroy1).toBe(true);
  });

  it('Should generate leeroy context', () => {
    const leeroy1 = generate(leeroy0x9c6d7a1a as Transaction);
    expect(leeroy1.context?.summaries.category).toBe('PROTOCOL_1');
    expect(leeroy1.context?.summaries.en.title).toBe('Leeroy');
    expect(leeroy1.context?.summaries.en.variables?.contextAction?.value).toBe(
      'posted',
    );
  });

  it('Should not detect as leeroy', () => {
    const leeroy1 = detect(catchall0xc35c01ac as Transaction);
    expect(leeroy1).toBe(false);
  });
});

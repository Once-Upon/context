import { LeeroyContextActionEnum, Transaction } from '../../../types';
import { detect, generate } from './leeroy';
import leeroy0x9c6d7a1a from '../../test/transactions/leeroy-0x9c6d7a1a.json';
import leeroy0xa8afad2c from '../../test/transactions/leeroy-0xa8afad2c.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Leeroy', () => {
  it('Should detect leeroy', () => {
    const leeroy1 = detect(leeroy0x9c6d7a1a as unknown as Transaction);
    expect(leeroy1).toBe(true);

    const leeroy2 = detect(leeroy0xa8afad2c as unknown as Transaction);
    expect(leeroy2).toBe(true);
  });

  it('Should generate leeroy context', () => {
    const leeroy1 = generate(leeroy0x9c6d7a1a as unknown as Transaction);
    expect(leeroy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(leeroy1.context?.summaries?.en.title).toBe('Leeroy');
    expect(leeroy1.context?.variables?.contextAction['value']).toBe(
      LeeroyContextActionEnum.POSTED,
    );

    const leeroy2 = generate(leeroy0xa8afad2c as unknown as Transaction);
    expect(leeroy2.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(leeroy2.context?.summaries?.en.title).toBe('Leeroy');
    expect(leeroy2.context?.variables?.contextAction['value']).toBe(
      LeeroyContextActionEnum.TIPPED,
    );
  });

  it('Should not detect as leeroy', () => {
    const leeroy1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(leeroy1).toBe(false);
  });
});

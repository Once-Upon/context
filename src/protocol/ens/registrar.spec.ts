import { Transaction } from '../../types';
import { detect, generate } from './registrar';
import { contextSummary } from '../../helpers/utils';
import ens0xdb203e93 from '../../test/transactions/ens-0xdb203e93.json';
import ens0xea1b4ab6 from '../../test/transactions/ens-0xea1b4ab6.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ENS Registrar', () => {
  it('Should detect ens registrar', () => {
    const ensRegistrar1 = detect(ens0xdb203e93 as Transaction);
    expect(ensRegistrar1).toBe(true);

    const ensRegistrar2 = detect(ens0xea1b4ab6 as Transaction);
    expect(ensRegistrar2).toBe(true);
  });

  it('Should generate ens context', () => {
    const ensRegistrar1 = generate(ens0xdb203e93 as Transaction);
    expect(ensRegistrar1.context?.summaries?.en.title).toBe('ENS');
    const desc1 = contextSummary(ensRegistrar1.context);
    expect(desc1).toBe(
      '0xfa929fc3e365050e539360fb4d4bf971dcf28eda REGISTERED payblock.eth for 365 days',
    );

    const ensRegistrar2 = generate(ens0xea1b4ab6 as Transaction);
    expect(ensRegistrar2.context?.summaries?.en.title).toBe('ENS');
    const desc2 = contextSummary(ensRegistrar2.context);
    expect(desc2).toBe(
      '0x5fb33d75a1cfcdc922e736c06e01c1505b4643db REGISTERED liljvb.eth for 365 days',
    );
  });

  it('Should not detect as ens registrar', () => {
    const ensRegistrar1 = detect(catchall0xc35c01ac as Transaction);
    expect(ensRegistrar1).toBe(false);
  });
});

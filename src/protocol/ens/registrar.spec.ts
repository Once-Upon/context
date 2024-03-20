import { Transaction } from '../../types';
import { detect, generate } from './registrar';
import { containsBigInt, contextSummary } from '../../helpers/utils';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import ens0xdb203e93 from '../../test/transactions/ens-0xdb203e93.json';
import ens0xea1b4ab6 from '../../test/transactions/ens-0xea1b4ab6.json';
import ensRegistrarCommit0x2adbae73 from '../../test/transactions/ensRegistrarCommit-0x2adbae73.json';
import ensBulkRenew0x25add712 from '../../test/transactions/ensBulkRenew-0x25add712.json';
import registrarWithConfig0x5d31a49e from '../../test/transactions/registrarWithConfig-0x5d31a49e.json';

describe('ENS Registrar', () => {
  it('Should detect ens registrar', () => {
    const ensRegistrar1 = detect(ens0xdb203e93 as Transaction);
    expect(ensRegistrar1).toBe(true);

    const ensRegistrar2 = detect(ens0xea1b4ab6 as Transaction);
    expect(ensRegistrar2).toBe(true);

    const bulkCommit = detect(ensRegistrarCommit0x2adbae73 as Transaction);
    expect(bulkCommit).toBe(true);

    const bulkRenew = detect(ensBulkRenew0x25add712 as Transaction);
    expect(bulkRenew).toBe(true);

    const registrarWithConfig = detect(
      registrarWithConfig0x5d31a49e as Transaction,
    );
    expect(registrarWithConfig).toBe(true);
  });

  it('Should generate ens context', () => {
    const ensRegistrar1 = generate(ens0xdb203e93 as Transaction);
    expect(ensRegistrar1.context?.summaries?.en.title).toBe('ENS');
    const desc1 = contextSummary(ensRegistrar1.context);
    expect(desc1).toBe(
      '0xfa929fc3e365050e539360fb4d4bf971dcf28eda REGISTERED payblock.eth for 365 days',
    );
    expect(containsBigInt(ensRegistrar1.context)).toBe(false);

    const ensRegistrar2 = generate(ens0xea1b4ab6 as Transaction);
    expect(ensRegistrar2.context?.summaries?.en.title).toBe('ENS');
    const desc2 = contextSummary(ensRegistrar2.context);
    expect(desc2).toBe(
      '0x5fb33d75a1cfcdc922e736c06e01c1505b4643db REGISTERED liljvb.eth for 365 days',
    );
    expect(containsBigInt(ensRegistrar1.context)).toBe(false);
  });

  it('Should generate bulk ens context', () => {
    // bulk commit
    const bulkCommit = generate(ensRegistrarCommit0x2adbae73 as Transaction);
    expect(bulkCommit.context?.summaries?.en.title).toBe('ENS');
    const desc1 = contextSummary(bulkCommit.context);
    expect(desc1).toBe(
      '0x7f9fe1b6e8e462640e78e2b82c792dfbf9175cc9 COMMITTED_TO registering an ENS name',
    );
    expect(containsBigInt(bulkCommit.context)).toBe(false);

    // bulk renew
    const bulkRenew = generate(ensBulkRenew0x25add712 as Transaction);
    expect(bulkRenew.context?.summaries?.en.title).toBe('ENS');
    const desc2 = contextSummary(bulkRenew.context);
    expect(desc2).toBe(
      '0x3785f0272f5e19dd2c27977ec2d91195bb2af801 RENEWED ntidi.eth for 730 days',
    );
    expect(containsBigInt(bulkRenew.context)).toBe(false);

    // registrar with config
    const registrarWithConfig = generate(
      registrarWithConfig0x5d31a49e as Transaction,
    );
    expect(bulkRenew.context?.summaries?.en.title).toBe('ENS');
    const desc3 = contextSummary(registrarWithConfig.context);
    expect(desc3).toBe(
      '0xed53c087b05d1360e78f8a3e4dc59f8d342296f9 REGISTERED sunnysd.eth for 730 days',
    );
    expect(containsBigInt(registrarWithConfig.context)).toBe(false);
  });

  it('Should not detect as ens registrar', () => {
    const ensRegistrar1 = detect(catchall0xc35c01ac as Transaction);
    expect(ensRegistrar1).toBe(false);
  });
});

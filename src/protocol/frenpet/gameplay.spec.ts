import { Transaction } from '../../types';
import { detectFrenPet, generateFrenPetContext } from './gameplay';
import { contextSummary } from '../../helpers/utils';
import frenpet0x18a097a8 from '../../test/transactions/frenpet-0x18a097a8.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Frenpet', () => {
  it('Should detect as frenpet', () => {
    const frenpet1 = detectFrenPet(frenpet0x18a097a8 as Transaction);
    expect(frenpet1).toBe(true);
  });

  it('Should generate frenpet context', () => {
    const frenpet1 = generateFrenPetContext(frenpet0x18a097a8 as Transaction);
    expect(frenpet1.context.summaries.en.title).toBe('Fren Pet');
    expect(frenpet1.context.summaries.category).toBe('PROTOCOL_1');
    const desc1 = contextSummary(frenpet1.context);
    expect(desc1).toBe(
      '0x30e49549da679ec277301ffe4e66ac76aa1cc413 set pet name for 0x5b51cf49cb48617084ef35e7c7d7a21914769ff1 #13759 to Folded Space NFT #30',
    );
  });

  it('Should not detect as frenpet', () => {
    const frenpet1 = detectFrenPet(catchall0xc35c01ac as Transaction);
    expect(frenpet1).toBe(false);
  });
});

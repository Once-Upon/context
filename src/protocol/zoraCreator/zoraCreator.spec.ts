import { Transaction } from '../../types';
import { detect, generate } from './zoraCreator';
import mintWithRewards0x6ccb3140 from '../../test/transactions/mintWithRewards-0x6ccb3140.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Zora Creator', () => {
  it('Should detect zora creator transaction', () => {
    const zoraCreator1 = detect(mintWithRewards0x6ccb3140 as Transaction);
    expect(zoraCreator1).toBe(true);
  });

  it('Should generate context for mintWithRewards transaction', () => {
    const zoraCreator1 = generate(mintWithRewards0x6ccb3140 as Transaction);
    expect(zoraCreator1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(zoraCreator1.context?.summaries?.en.title).toBe('Disperse');
    const desc1 = contextSummary(zoraCreator1.context);
    expect(desc1).toBe(
      '0x0de290f9717764641b9694c246338a477cff9543 TIPPED 0x3e6c23cdaa52b1b6621dbb30c367d16ace21f760 0.0009 ETH',
    );
  });

  it('Should not detect as disperseEth', () => {
    const zoraCreator1 = detect(catchall0xc35c01ac as Transaction);
    expect(zoraCreator1).toBe(false);
  });
});

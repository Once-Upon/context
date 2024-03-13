import { Transaction } from '../../types';
import { detect, generate } from './zoraCreator';
import mintWithRewards0x6ccb3140 from '../../test/transactions/mintWithRewards-0x6ccb3140.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../helpers/utils';

describe('Zora Creator', () => {
  it('Should detect zora creator transaction', () => {
    const zoraCreator1 = detect(mintWithRewards0x6ccb3140 as Transaction);
    expect(zoraCreator1).toBe(true);
  });

  it('Should generate context for mintWithRewards transaction', () => {
    const zoraCreator1 = generate(mintWithRewards0x6ccb3140 as Transaction);
    expect(zoraCreator1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(zoraCreator1.context?.summaries?.en.title).toBe('ZoraCreator');
    const desc1 = contextSummary(zoraCreator1.context);
    expect(desc1).toBe(
      '0x6bd6d5f98c5ad557eed0df2fd73b9666188cac96 MINTED 1 0xf41a3e3033d4e878943194b729aec993a4ea2045 #26 for 0.000777 ETH with 0.000111 ETH in rewards for 0xEcfc2ee50409E459c554a2b0376F882Ce916D853',
    );
    expect(containsBigInt(zoraCreator1.context)).toBe(false);
  });

  it('Should not detect as zora creator', () => {
    const zoraCreator1 = detect(catchall0xc35c01ac as Transaction);
    expect(zoraCreator1).toBe(false);
  });
});

import { Transaction } from '../../../types';
import { detect, generate } from './zoraCreator';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import mintWithRewards0x6ccb3140 from '../../test/transactions/mintWithRewards-0x6ccb3140.json';
import zoraMintWithRewards0x837a9a69 from '../../test/transactions/zoraMintWithRewards-0x837a9a69.json';
import zoraMint0x9f62a82c from '../../test/transactions/zoraMint-0x9f62a82c.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Zora Mint', () => {
  it('Should detect zora mint with rewards transaction', () => {
    const zoraMintWithRewards1 = detect(
      mintWithRewards0x6ccb3140 as unknown as Transaction,
    );
    expect(zoraMintWithRewards1).toBe(true);

    const zoraMintWithRewards2 = detect(
      zoraMintWithRewards0x837a9a69 as unknown as Transaction,
    );
    expect(zoraMintWithRewards2).toBe(true);

    const zoraMintWithRewards3 = detect(
      zoraMint0x9f62a82c as unknown as Transaction,
    );
    expect(zoraMintWithRewards3).toBe(true);
  });

  it('Should generate context for mintWithRewards transaction', () => {
    const zoraMintWithRewards1 = generate(
      mintWithRewards0x6ccb3140 as unknown as Transaction,
    );
    expect(zoraMintWithRewards1.context?.summaries?.category).toBe(
      'PROTOCOL_1',
    );
    expect(zoraMintWithRewards1.context?.summaries?.en.title).toBe('Zora');
    const desc1 = contextSummary(zoraMintWithRewards1.context);
    expect(desc1).toBe(
      '0x6bd6d5f98c5ad557eed0df2fd73b9666188cac96 MINTED 1 0xf41a3e3033d4e878943194b729aec993a4ea2045 #26 for 0.000777 ETH with 0.000111 ETH in rewards for 0xecfc2ee50409e459c554a2b0376f882ce916d853',
    );
    expect(containsBigInt(zoraMintWithRewards1.context)).toBe(false);

    const zoraMintWithRewards2 = generate(
      zoraMintWithRewards0x837a9a69 as unknown as Transaction,
    );
    expect(zoraMintWithRewards2.context?.summaries?.category).toBe(
      'PROTOCOL_1',
    );
    expect(zoraMintWithRewards2.context?.summaries?.en.title).toBe('Zora');
    const desc2 = contextSummary(zoraMintWithRewards2.context);
    expect(desc2).toBe(
      '0xf70da97812cb96acdf810712aa562db8dfa3dbef MINTED 1 0xf41a3e3033d4e878943194b729aec993a4ea2045 #29 to 0xd97622b57112f82a0db8b1aee08e37aa6b4b2a03 for 0.000777 ETH with 0.000111 ETH in rewards for 0xecfc2ee50409e459c554a2b0376f882ce916d853',
    );
    expect(containsBigInt(zoraMintWithRewards2.context)).toBe(false);

    const zoraMintWithRewards3 = generate(
      zoraMint0x9f62a82c as unknown as Transaction,
    );
    expect(zoraMintWithRewards3.context?.summaries?.category).toBe(
      'PROTOCOL_1',
    );
    expect(zoraMintWithRewards3.context?.summaries?.en.title).toBe('Zora');
    const desc3 = contextSummary(zoraMintWithRewards3.context);
    expect(desc3).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 MINTED 28 x 0x878dd96c70b1bef2d1a4c307266579cb958cbf04 for 0.021756 ETH with 0.000111 ETH in rewards for 0x7bf90111ad7c22bec9e9dff8a01a44713cc1b1b6',
    );
    expect(containsBigInt(zoraMintWithRewards3.context)).toBe(false);
  });

  it('Should not detect as zora creator', () => {
    const zoraMintWithRewards1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(zoraMintWithRewards1).toBe(false);
  });
});

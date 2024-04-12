import { Transaction } from '../../../types';
import { detect, generate } from './highlight';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import highlight0x61e3c3cb from '../../test/transactions/highlight-0x61e3c3cb.json';
import highlightErc20_0x1f0c411b from '../../test/transactions/highlightErc20-0x1f0c411b.json';
import { containsBigInt, contextSummary } from '../../../helpers/utils';

describe('Highlight', () => {
  it('Should detect as highlight', () => {
    const highlightMintWithRewards1 = detect(
      highlight0x61e3c3cb as unknown as Transaction,
    );
    expect(highlightMintWithRewards1).toBe(true);
  });

  it('Should generate context for creator rewards transaction', () => {
    const highlightMintWithRewards1 = generate(
      highlight0x61e3c3cb as unknown as Transaction,
    );
    expect(highlightMintWithRewards1.context?.summaries?.category).toBe(
      'PROTOCOL_1',
    );
    expect(highlightMintWithRewards1.context?.summaries?.en.title).toBe(
      'Highlight',
    );
    const desc1 = contextSummary(highlightMintWithRewards1.context);
    expect(desc1).toBe(
      '0x0989cd2871b36d638140354731301a32d2409c3a MINTED 0x31c5c70330c9a1d3099d8f77381e82a218d5c71a #2 for 0.0008 ETH with 0.0004 ETH in rewards for 0x0989cd2871b36d638140354731301a32d2409c3a',
    );
    expect(containsBigInt(highlightMintWithRewards1.context)).toBe(false);
  });

  it('Should generate context for creator rewards ERC20 transaction', () => {
    const highlightMintWithRewardsErc20 = generate(
      highlightErc20_0x1f0c411b as unknown as Transaction,
    );
    expect(highlightMintWithRewardsErc20.context?.summaries?.category).toBe(
      'PROTOCOL_1',
    );
    expect(highlightMintWithRewardsErc20.context?.summaries?.en.title).toBe(
      'Highlight',
    );
    const desc1 = contextSummary(highlightMintWithRewardsErc20.context);
    expect(desc1).toBe(
      '0x0989cd2871b36d638140354731301a32d2409c3a MINTED 0x31c5c70330c9a1d3099d8f77381e82a218d5c71a #3 for 72000000000000000000 0x13a75904899733587219d10c3af2f198408c7f7c with 36000000000000000000 0x13a75904899733587219d10c3af2f198408c7f7c in rewards for 0x0989cd2871b36d638140354731301a32d2409c3a',
    );
    expect(containsBigInt(highlightMintWithRewardsErc20.context)).toBe(false);
  });

  it('Should not detect as highlight', () => {
    const highlightMintWithRewards1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(highlightMintWithRewards1).toBe(false);
  });
});

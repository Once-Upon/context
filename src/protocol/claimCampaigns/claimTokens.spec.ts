import { Transaction } from '../../types';
import { detect, generate } from './claimTokens';
import enjoyClaimTokens0x266b5c9d from '../../test/transactions/enjoyClaimTokens-0x266b5c9d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../helpers/utils';

describe('Enjoy claimTokens', () => {
  it('Should detect enjoy claimTokens', () => {
    const enjoy1 = detect(enjoyClaimTokens0x266b5c9d as unknown as Transaction);
    expect(enjoy1).toBe(true);
  });

  it('Should generate context for enjoy claimTokens', () => {
    const enjoy1 = generate(
      enjoyClaimTokens0x266b5c9d as unknown as Transaction,
    );
    expect(enjoy1.context?.summaries?.category).toBe('PROTOCOL_1');
    expect(enjoy1.context?.summaries?.en.title).toBe('Claim');
    const desc1 = contextSummary(enjoy1.context);
    expect(desc1).toBe(
      '0x7f23f1c4be15fa3adabc821de9ef70efa5503f24 CLAIMED 1872025000000000000000000 0xa6b280b42cb0b7c4a4f789ec6ccc3a7609a1bc39',
    );
    expect(containsBigInt(enjoy1.context)).toBe(false);
  });

  it('Should not detect as enjoy', () => {
    const enjoy1 = detect(catchall0xc35c01ac as Transaction);
    expect(enjoy1).toBe(false);
  });
});

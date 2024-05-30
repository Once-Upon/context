import { Transaction } from '../../../types';
import { detect, generate } from './tokenAirdrop';
import tokenAirdrop0x9559fbd9 from '../../test/transactions/tokenAirdrop-0x9559fbd9.json';
import tokenAirdrop0xe2a9a20b from '../../test/transactions/tokenAirdrop-0xe2a9a20b.json';
import tokenAirdrop0xb312ecc2 from '../../test/transactions/tokenAirdrop-0xb312ecc2.json';
import tokenAirdrop0xcce0327b from '../../test/transactions/tokenAirdrop-0xcce0327b.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { containsBigInt, contextSummary } from '../../../helpers/utils';

describe('Token Airdrop', () => {
  it('Should detect token airdrop transaction', () => {
    const tokenAirdrop1 = detect(
      tokenAirdrop0x9559fbd9 as unknown as Transaction,
    );
    expect(tokenAirdrop1).toBe(true);

    const tokenAirdrop2 = detect(
      tokenAirdrop0xe2a9a20b as unknown as Transaction,
    );
    expect(tokenAirdrop2).toBe(true);

    const tokenAirdrop3 = detect(
      tokenAirdrop0xb312ecc2 as unknown as Transaction,
    );
    expect(tokenAirdrop3).toBe(true);

    const tokenAirdrop4 = detect(
      tokenAirdrop0xcce0327b as unknown as Transaction,
    );
    expect(tokenAirdrop4).toBe(true);
  });

  it('should generate context for tokenAirdrop', () => {
    const transaction1 = generate(
      tokenAirdrop0x9559fbd9 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Token Airdrop');
    expect(contextSummary(transaction1.context)).toBe(
      '265 users RECEIVED_AIRDROP 0x1792a96e5668ad7c167ab804a100ce42395ce54d',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      tokenAirdrop0xe2a9a20b as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Token Airdrop');
    expect(contextSummary(transaction2.context)).toBe(
      '172 users RECEIVED_AIRDROP 0x1792a96e5668ad7c167ab804a100ce42395ce54d',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      tokenAirdrop0xb312ecc2 as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('Token Airdrop');
    expect(contextSummary(transaction3.context)).toBe(
      '182 users RECEIVED_AIRDROP 0xc9b82badf090551a9c5ff6010bbdfb39587bd007',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);

    const transaction4 = generate(
      tokenAirdrop0xcce0327b as unknown as Transaction,
    );
    expect(transaction4.context?.summaries?.en.title).toBe('Token Airdrop');
    expect(contextSummary(transaction4.context)).toBe(
      '51 users RECEIVED_AIRDROP 150 assets from 0xbcac490d0447b41e77fa7d5ec701659dfc348636',
    );
    expect(containsBigInt(transaction4.context)).toBe(false);
  });

  it('Should not detect token airdrop transaction', () => {
    const tokenAirdrop1 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(tokenAirdrop1).toBe(false);
  });
});

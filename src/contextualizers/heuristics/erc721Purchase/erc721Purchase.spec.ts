import { Transaction } from '../../../types';
import { detect, generate } from './erc721Purchase';
import { contextSummary } from '../../../helpers/utils';
import erc721Purchase0x2558f104 from '../../test/transactions/erc721Purchase-0x2558f104.json';
import erc721Purchase0x97a38a23 from '../../test/transactions/erc721Purchase-0x97a38a23.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC721 Purchase', () => {
  it('Should detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(
      erc721Purchase0x2558f104 as unknown as Transaction,
    );
    expect(isERC721Purchase1).toBe(true);

    const isERC721Purchase2 = detect(
      erc721Purchase0x97a38a23 as unknown as Transaction,
    );
    expect(isERC721Purchase2).toBe(true);
  });

  it('Should generate ERC721 Purchase context', () => {
    const erc721Purchase1 = generate(
      erc721Purchase0x2558f104 as unknown as Transaction,
    );
    expect(erc721Purchase1.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721Purchase1.context?.variables?.tokenOrTokens['value']).toBe(
      '0x82f5ef9ddc3d231962ba57a9c2ebb307dc8d26c2',
    );
    expect(erc721Purchase1.context?.variables?.numOfToken['value']).toBe(2);
    const desc1 = contextSummary(erc721Purchase1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BOUGHT 2 0x82f5ef9ddc3d231962ba57a9c2ebb307dc8d26c2 for 0.05 ETH from 2 users',
    );

    const erc721Purchase2 = generate(
      erc721Purchase0x97a38a23 as unknown as Transaction,
    );
    expect(erc721Purchase2.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721Purchase2.context?.variables?.tokenOrTokens['value']).toBe(
      '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    );
    expect(erc721Purchase2.context?.variables?.numOfToken['value']).toBe(5);
    const desc2 = contextSummary(erc721Purchase2.context);
    expect(desc2).toBe(
      '0xa3eac0016f6581ac34768c0d4b99ddcd88071c3c BOUGHT 5 0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270 for 4.73 ETH from 4 users',
    );
  });

  it('Should not detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(isERC721Purchase1).toBe(false);
  });
});

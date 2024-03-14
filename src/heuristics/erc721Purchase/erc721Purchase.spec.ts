import { Transaction } from '../../types';
import { detect, generate } from './erc721Purchase';
import { contextSummary } from '../../helpers/utils';
import erc721Purchase0x2558f104 from '../../test/transactions/erc721Purchase-0x2558f104.json';
import erc721Purchase0x97a38a23 from '../../test/transactions/erc721Purchase-0x97a38a23.json';
import erc721Sale0x05b8cee6 from '../../test/transactions/erc721Sale-0x05b8cee6.json';
import catchall0x80c1b6eb from '../../test/transactions/catchall-0x80c1b6eb.json';

describe('ERC721 Purchase', () => {
  it('Should detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(erc721Purchase0x2558f104 as Transaction);
    expect(isERC721Purchase1).toBe(true);

    const isERC721Purchase2 = detect(erc721Purchase0x97a38a23 as Transaction);
    expect(isERC721Purchase2).toBe(true);

    const isERC721Purchase3 = detect(erc721Sale0x05b8cee6 as Transaction);
    expect(isERC721Purchase3).toBe(true);
  });

  it('Should generate ERC721 Purchase context', () => {
    const erc721Purchase1 = generate(erc721Purchase0x2558f104 as Transaction);
    expect(erc721Purchase1.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721Purchase1.context?.variables?.tokenOrTokens['value']).toBe(
      '0x82f5ef9ddc3d231962ba57a9c2ebb307dc8d26c2',
    );
    expect(erc721Purchase1.context?.variables?.numOfToken['value']).toBe(2);
    const desc1 = contextSummary(erc721Purchase1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BOUGHT 2 0x82f5ef9ddc3d231962ba57a9c2ebb307dc8d26c2 for 0.05 ETH from 2 users',
    );

    const erc721Purchase2 = generate(erc721Purchase0x97a38a23 as Transaction);
    expect(erc721Purchase2.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721Purchase2.context?.variables?.tokenOrTokens['value']).toBe(
      '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
    );
    expect(erc721Purchase2.context?.variables?.numOfToken['value']).toBe(5);
    const desc2 = contextSummary(erc721Purchase2.context);
    expect(desc2).toBe(
      '0xa3eac0016f6581ac34768c0d4b99ddcd88071c3c BOUGHT 5 0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270 for 4.73 ETH from 4 users',
    );

    const erc721Purchase3 = generate(erc721Sale0x05b8cee6 as Transaction);
    expect(erc721Purchase3.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721Purchase3.context?.variables?.tokenOrTokens['token']).toBe(
      '0x598061a4ac7fa240acc3e7025b4b047ada178704',
    );
    expect(erc721Purchase3.context?.variables?.numOfToken['value']).toBe('');
    const desc3 = contextSummary(erc721Purchase3.context);
    expect(desc3).toBe(
      '0x940034ad75e41e2c0e968969efad37f127c7ded0 BOUGHT  0x598061a4ac7fa240acc3e7025b4b047ada178704 #331 for 12100000000000000 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2 from 0x8da3582320cc6420316af0ae145f95af8344af2d',
    );
  });

  it('Should not detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(catchall0x80c1b6eb as Transaction);
    expect(isERC721Purchase1).toBe(false);
  });
});

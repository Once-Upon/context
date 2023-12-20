import { Transaction } from '../../types';
import { detect, generate } from './erc721Purchase';
import { contextSummary } from '../../helpers/utils';
import erc721Purchase0x2558f104 from '../../test/transactions/erc721Purchase-0x2558f104.json';
import erc721Purchase0x97a38a23 from '../../test/transactions/erc721Purchase-0x97a38a23.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC721 Purchase', () => {
  it('Should detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(erc721Purchase0x2558f104 as Transaction);
    expect(isERC721Purchase1).toBe(true);

    const isERC721Purchase2 = detect(erc721Purchase0x97a38a23 as Transaction);
    expect(isERC721Purchase2).toBe(true);
  });

  it('Should generate ERC721 Purchase context', () => {
    const erc721Purchase1 = generate(erc721Purchase0x2558f104 as Transaction);
    const erc721PurchaseContext1 = erc721Purchase1.context || {};
    expect(erc721PurchaseContext1.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721PurchaseContext1.variables?.tokenOrTokens['value']).toBe(2);
    expect(erc721PurchaseContext1.variables?.tokenOrTokens['unit']).toBe(
      'NFTs',
    );
    const desc1 = contextSummary(erc721PurchaseContext1);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BOUGHT 2 NFTs for 0.05 ETH',
    );

    const erc721Purchase2 = generate(erc721Purchase0x97a38a23 as Transaction);
    const erc721PurchaseContext2 = erc721Purchase2.context || {};
    expect(erc721PurchaseContext2.summaries?.en.title).toBe('NFT Purchase');
    expect(erc721PurchaseContext2.variables?.tokenOrTokens['value']).toBe(5);
    expect(erc721PurchaseContext2.variables?.tokenOrTokens['unit']).toBe(
      'NFTs',
    );
    const desc2 = contextSummary(erc721PurchaseContext2);
    expect(desc2).toBe(
      '0xa3eac0016f6581ac34768c0d4b99ddcd88071c3c BOUGHT 5 NFTs for 4.73 ETH',
    );
  });

  it('Should not detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC721Purchase1).toBe(false);
  });
});

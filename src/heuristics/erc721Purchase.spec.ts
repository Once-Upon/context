import { Transaction } from '../types';
import {
  detectERC721Purchase,
  generateERC21PurchaseContext,
} from './erc721Purchase';
import erc721Purchase0x2558f104 from '../test/transactions/erc721Purchase-0x2558f104.json';
import erc721Purchase0x05b8cee6 from '../test/transactions/erc721Purchase-0x05b8cee6.json';
import erc721Purchase0xdeba4248 from '../test/transactions/erc721Purchase-0xdeba4248.json';

describe('ERC721 Purchase', () => {
  it('Should detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detectERC721Purchase(
      erc721Purchase0x2558f104 as Transaction,
    );
    expect(isERC721Purchase1).toBe(true);

    const isERC721Purchase2 = detectERC721Purchase(
      erc721Purchase0x05b8cee6 as Transaction,
    );
    expect(isERC721Purchase2).toBe(true);
    const isERC721Purchase3 = detectERC721Purchase(
      erc721Purchase0xdeba4248 as Transaction,
    );
    expect(isERC721Purchase3).toBe(true);
  });

  it('Should create ERC721 Purchase context', () => {
    const result1 = generateERC21PurchaseContext(
      erc721Purchase0xdeba4248 as Transaction,
    );
    expect(result1.context.summaries.en.title).toBe('NFT Purchase');
  });
});

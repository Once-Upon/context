import { Transaction } from '../types';
import { detectERC721Purchase } from './erc721Purchase';
import erc721Purchase0x2558f104 from '../test-data/transactions/erc721Purchase-0x2558f104.json';
import erc721Purchase0x05b8cee6 from '../test-data/transactions/erc721Purchase-0x05b8cee6.json';

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
  });
});

import { Transaction } from '../types';
import { detectERC721Purchase } from './erc721Purchase';
import erc721Purchase0x2558f104 from '../test/transactions/erc721Purchase-0x2558f104.json';
import catchall0xc35c01ac from '../test/transactions/catchall-0xc35c01ac.json';

describe('ERC721 Purchase', () => {
  it('Should detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detectERC721Purchase(
      erc721Purchase0x2558f104 as Transaction,
    );
    expect(isERC721Purchase1).toBe(true);
  });

  it('Should not detect ERC721 Purchase transaction', () => {
    const isERC721Purchase1 = detectERC721Purchase(
      catchall0xc35c01ac as Transaction,
    );
    expect(isERC721Purchase1).toBe(false);
  });
});

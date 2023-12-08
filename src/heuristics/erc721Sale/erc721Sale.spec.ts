import { Transaction } from '../../types';
import { detect } from './erc721Sale';
import erc721Sale0x05b8cee6 from '../../test/transactions/erc721Sale-0x05b8cee6.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC721 Sale', () => {
  it('Should detect ERC721 Sale transaction', () => {
    const isERC721Sale1 = detect(erc721Sale0x05b8cee6 as Transaction);
    expect(isERC721Sale1).toBe(true);
  });

  it('Should not detect ERC721 Sale transaction', () => {
    const isERC721Sale1 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC721Sale1).toBe(false);
  });
});

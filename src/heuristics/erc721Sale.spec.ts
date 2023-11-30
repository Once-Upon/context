import { Transaction } from '../types';
import { detectERC721Sale } from './erc721Sale';
import erc721Sale0x05b8cee6 from '../test/transactions/erc721Sale-0x05b8cee6.json';

describe('ERC721 Sale', () => {
  it('Should detect ERC721 Sale transaction', () => {
    const isERC721Sale1 = detectERC721Sale(erc721Sale0x05b8cee6 as Transaction);
    expect(isERC721Sale1).toBe(true);
  });
});

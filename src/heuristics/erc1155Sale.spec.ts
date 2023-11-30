import { Transaction } from '../types';
import { detectERC1155Sale } from './erc1155Sale';
import erc1155Sale0x16b2334d from '../test/transactions/erc1155Sale-0x16b2334d.json';

describe('ERC1155 Sale', () => {
  it('Should detect ERC1155 Sale transaction', () => {
    const isERC1155Sale1 = detectERC1155Sale(
      erc1155Sale0x16b2334d as Transaction,
    );
    expect(isERC1155Sale1).toBe(true);
  });
});

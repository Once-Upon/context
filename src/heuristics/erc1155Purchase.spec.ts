import { Transaction } from '../types';
import { detectERC1155Purchase } from './erc1155Purchase';
import erc1155Purchase0x156df9f7 from '../test/transactions/erc1155Purchase-0x156df9f7.json';

describe('ERC1155 Purchase', () => {
  it('Should detect ERC1155 Purchase transaction', () => {
    const isERC1155Purchase1 = detectERC1155Purchase(
      erc1155Purchase0x156df9f7 as Transaction,
    );
    expect(isERC1155Purchase1).toBe(true);
  });
});

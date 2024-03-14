import { Transaction } from '../../types';
import { detect } from './erc1155Purchase';
import erc1155Purchase0x156df9f7 from '../../test/transactions/erc1155Purchase-0x156df9f7.json';
import erc1155Sale0x16b2334d from '../../test/transactions/erc1155Sale-0x16b2334d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('ERC1155 Purchase', () => {
  it('Should detect ERC1155 Purchase transaction', () => {
    const isERC1155Purchase1 = detect(erc1155Purchase0x156df9f7 as Transaction);
    expect(isERC1155Purchase1).toBe(true);

    const isERC1155Purchase2 = detect(erc1155Sale0x16b2334d as Transaction);
    expect(isERC1155Purchase2).toBe(true);
  });

  it('Should not detect ERC1155 Purchase transaction', () => {
    const isERC1155Purchase1 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC1155Purchase1).toBe(false);
  });
});

import { Transaction } from '../../../types';
import { detect, generate } from './erc1155Mint';
import erc1155Mint0x45d1ed7b from '../../test/transactions/erc1155Mint-0x45d1ed7b.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import erc1155MintBySomeoneElse from '../../test/transactions/erc1155MintBySomeoneElse-0xa9ddcb75.json';
import erc1155MintPaidWithEnjoy from '../../test/transactions/erc1155MintPaidWithEnjoy-0x7a3686d7.json';
import erc1155Mint0xdb571cc5 from '../../test/transactions/erc1155Mint-0xdb571cc5.json';
import erc1155Mint0x65bfc065 from '../../test/transactions/erc1155Mint-0x65bfc065.json';
import { contextSummary } from '../../../helpers/utils';

describe('ERC1155 Mint', () => {
  it('Should detect ERC1155 Mint transaction', () => {
    const erc1155Mint1 = detect(
      erc1155Mint0x45d1ed7b as unknown as Transaction,
    );
    expect(erc1155Mint1).toBe(true);

    const erc1155Mint2 = detect(
      erc1155Mint0xdb571cc5 as unknown as Transaction,
    );
    expect(erc1155Mint2).toBe(true);

    const erc1155Mint3 = detect(
      erc1155Mint0x65bfc065 as unknown as Transaction,
    );
    expect(erc1155Mint3).toBe(true);
  });

  it('Should detect ERC1155 Mint transaction when by someone else', () => {
    const erc1155Mint2 = detect(
      erc1155MintBySomeoneElse as unknown as Transaction,
    );
    expect(erc1155Mint2).toBe(true);
  });

  it('Should detect ERC1155 Mint transaction when paid in a non-ETH token', () => {
    const erc1155Mint3 = detect(
      erc1155MintPaidWithEnjoy as unknown as Transaction,
    );
    expect(erc1155Mint3).toBe(true);
  });

  it('Should not detect as ERC1155 Mint', () => {
    const isERC1155Mint1 = detect(
      erc20Swap0xd55dc9b2 as unknown as Transaction,
    );
    expect(isERC1155Mint1).toBe(false);

    const isERC1155Mint2 = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(isERC1155Mint2).toBe(false);
  });

  it('Should generate a context for ERC1155 Mint', () => {
    const tokenMint1 = generate(
      erc1155Mint0x45d1ed7b as unknown as Transaction,
    );
    expect(tokenMint1.context?.summaries?.category).toBe('NFT');
    const desc1 = contextSummary(tokenMint1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 MINTED 1 0xf4dd946d1406e215a87029db56c69e1bcf3e1773 #1',
    );
  });

  it('Should generate a context for ERC1155 Mint paid with another token', () => {
    const erc1155Mint3 = generate(
      erc1155MintPaidWithEnjoy as unknown as Transaction,
    );
    expect(erc1155Mint3.context?.summaries?.category).toBe('NFT');
    const desc3 = contextSummary(erc1155Mint3.context);
    expect(desc3).toBe(
      '0xf1156f02a3f50ab64bce6d637d36c0b77ec1d5a5 MINTED 113 0x634d2e86b78a69fbe91104b6077c0aa403867558 #14 for 113000000000000000000 0xa6b280b42cb0b7c4a4f789ec6ccc3a7609a1bc39',
    );
  });
});

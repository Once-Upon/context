import { Transaction } from '../../../types';
import { detect, generate } from './erc1155Mint';
import erc1155Mint0x45d1ed7b from '../../test/transactions/erc1155Mint-0x45d1ed7b.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import erc1155MintBySomeoneElse from '../../test/transactions/erc1155MintBySomeoneElse-0xa9ddcb75.json';
import erc1155Mint0xdb571cc5 from '../../test/transactions/erc1155Mint-0xdb571cc5.json';
import erc1155Mint0x65bfc065 from '../../test/transactions/erc1155Mint-0x65bfc065.json';
import { contextSummary } from '../../../helpers/utils';

describe('ERC1155 Mint', () => {
  it('Should detect ERC1155 Mint transaction', () => {
    const erc1155Mint1 = detect(erc1155Mint0x45d1ed7b as Transaction);
    expect(erc1155Mint1).toBe(true);

    const erc1155Mint2 = detect(erc1155Mint0xdb571cc5 as Transaction);
    expect(erc1155Mint2).toBe(true);

    const erc1155Mint3 = detect(erc1155Mint0x65bfc065 as Transaction);
    expect(erc1155Mint3).toBe(true);
  });

  it('Should detect ERC1155 Mint transaction when by someone else', () => {
    const erc1155Mint2 = detect(erc1155MintBySomeoneElse as Transaction);
    expect(erc1155Mint2).toBe(true);
  });

  it('Should not detect as ERC1155 Mint', () => {
    const isERC1155Mint1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isERC1155Mint1).toBe(false);

    const isERC1155Mint2 = detect(catchall0xc35c01ac as Transaction);
    expect(isERC1155Mint2).toBe(false);
  });

  it('Should generate a context for ERC1155 Mint', () => {
    const tokenMint1 = generate(erc1155Mint0x45d1ed7b as Transaction);
    expect(tokenMint1.context?.summaries?.category).toBe('NFT');
    const desc1 = contextSummary(tokenMint1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 MINTED 1 0xf4dd946d1406e215a87029db56c69e1bcf3e1773 #1',
    );
  });
});

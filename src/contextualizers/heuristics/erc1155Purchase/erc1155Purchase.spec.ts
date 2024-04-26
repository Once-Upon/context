import { Transaction } from '../../../types';
import { detect, generate } from './erc1155Purchase';
import erc1155Purchase0x156df9f7 from '../../test/transactions/erc1155Purchase-0x156df9f7.json';
import erc1155Sale0x16b2334d from '../../test/transactions/erc1155Sale-0x16b2334d.json';
import erc1155Purchase0xc6c925c0 from '../../test/transactions/erc1155Purchase-0xc6c925c0.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../../helpers/utils';

describe('ERC1155 Purchase', () => {
  it('Should detect ERC1155 Purchase transaction', () => {
    const isERC1155Purchase1 = detect(
      erc1155Purchase0x156df9f7 as unknown as Transaction,
    );
    expect(isERC1155Purchase1).toBe(true);

    const isERC1155Purchase2 = detect(
      erc1155Sale0x16b2334d as unknown as Transaction,
    );
    expect(isERC1155Purchase2).toBe(true);

    const isERC1155Purchase3 = detect(
      erc1155Purchase0xc6c925c0 as unknown as Transaction,
    );
    expect(isERC1155Purchase3).toBe(true);
  });

  it('Should generate context for ERC1155 Purchase', () => {
    const erc1155Purchase1 = generate(
      erc1155Purchase0xc6c925c0 as unknown as Transaction,
    );
    expect(erc1155Purchase1.context?.summaries?.en.title).toBe('NFT Purchase');
    expect(erc1155Purchase1.context?.variables?.tokenOrTokens['token']).toBe(
      '0x6541dc28acb78e1b024f5ffe1c840bc3e6fcf36a',
    );
    expect(erc1155Purchase1.context?.variables?.tokenOrTokens['tokenId']).toBe(
      '1',
    );
    expect(erc1155Purchase1.context?.variables?.tokenOrTokens['value']).toBe(
      '1',
    );
    const desc1 = contextSummary(erc1155Purchase1.context);
    expect(desc1).toBe(
      '0x15cc6926a4bea1eb176a738f7a8c63e65b437f84 BOUGHT 1 0x6541dc28acb78e1b024f5ffe1c840bc3e6fcf36a #1 for 0.00824 ETH from 0x1ddbaec4f1d056bcb6a6e7a6f2e8790ff2ae552b',
    );
  });

  it('Should not detect ERC1155 Purchase transaction', () => {
    const isERC1155Purchase1 = detect(
      catchall0xc35c01ac as unknown as Transaction,
    );
    expect(isERC1155Purchase1).toBe(false);
  });
});

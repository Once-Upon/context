import { Transaction } from '../../types';
import { detect, generate } from './erc721Mint';
import erc721Mint0x2c8a3ed1 from '../../test/transactions/erc721Mint-0x2c8a3ed1.json';
import erc721Mint0x35f54999 from '../../test/transactions/erc721Mint-0x35f54999.json';
import erc721Mint0x02e0551e from '../../test/transactions/erc721Mint-0x02e0551e.json';
import erc20Swap0xd55dc9b2 from '../../test/transactions/erc20Swap-0xd55dc9b2.json';
import { contextSummary } from '../../helpers/utils';

describe('ERC721 Mint', () => {
  it('Should detect ERC721 Mint transaction', () => {
    const erc721Mint1 = detect(erc721Mint0x2c8a3ed1 as Transaction);
    expect(erc721Mint1).toBe(true);

    const erc721Mint2 = detect(erc721Mint0x35f54999 as Transaction);
    expect(erc721Mint2).toBe(true);

    const erc721Mint3 = detect(erc721Mint0x02e0551e as unknown as Transaction);
    expect(erc721Mint3).toBe(true);
  });

  it('Should not detect as ERC721 Mint', () => {
    const isErc721Mint1 = detect(erc20Swap0xd55dc9b2 as Transaction);
    expect(isErc721Mint1).toBe(false);
  });

  it('Should generate a context for token mint', () => {
    const erc721Mint1 = generate(
      erc721Mint0x02e0551e as unknown as Transaction,
    );
    expect(erc721Mint1.context?.summaries?.category).toBe('NFT');
    const desc1 = contextSummary(erc721Mint1.context);
    expect(desc1).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 MINTED 10 x 0x251c3246642dbcc5473ae8700a14a11522a4302c for 0.1 ETH',
    );

    const erc721Mint2 = generate(erc721Mint0x35f54999 as Transaction);
    expect(erc721Mint2.context?.summaries?.category).toBe('NFT');
    const desc2 = contextSummary(erc721Mint2.context);
    expect(desc2).toBe(
      '0xb8edb17cd08dd854dee002f898b4f7cb3763ce75 MINTED 0x13303b4ee819fac204be5ef77523cfcd558c082f #4070',
    );
  });
});

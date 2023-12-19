import { makeContextualize } from './helpers/utils';
import { protocolContextualizer } from './protocol';
import { heuristicContextualizer } from './heuristics';
import { Transaction } from './types';

// contract deployed
import contractDeployed0x88e7d866 from './test/transactions/contractDeployed-0x88e7d866.json';
// erc20swap
import erc20Swap0x8cb66698 from './test/transactions/erc20Swap-0x8cb66698.json';
import erc20Swap0xd55dc9b2 from './test/transactions/erc20Swap-0xd55dc9b2.json';
// erc721  purchase
import erc721Purchase0x2558f104 from './test/transactions/erc721Purchase-0x2558f104.json';
// erc721 sale
import erc721Sale0x05b8cee6 from './test/transactions/erc721Sale-0x05b8cee6.json';
// erc1155 purchase
import erc1155Purchase0x156df9f7 from './test/transactions/erc1155Purchase-0x156df9f7.json';
// erc1155 sale
import erc1155Sale0x16b2334d from './test/transactions/erc1155Sale-0x16b2334d.json';
// idm
import idm0xf07ff1ad from './test/transactions/idm-0xf07ff1ad.json';
// token airdrop
import tokenAirdrop0x9559fbd9 from './test/transactions/tokenAirdrop-0x9559fbd9.json';
import tokenAirdrop0xe2a9a20b from './test/transactions/tokenAirdrop-0xe2a9a20b.json';
import tokenAirdrop0xb312ecc2 from './test/transactions/tokenAirdrop-0xb312ecc2.json';
// token approval
import tokenApproval0x567130ba from './test/transactions/tokenApproval-0x567130ba.json';
import tokenApproval0x06f15d49 from './test/transactions/tokenApproval-0x06f15d49.json';
import tokenApproval0xa0c2a425 from './test/transactions/tokenApproval-0xa0c2a425.json';
// token mint
import erc721MintMint0x2c8a3ed1 from './test/transactions/erc721Mint-0x2c8a3ed1.json';
import erc1155Mint0x45d1ed7b from './test/transactions/erc1155Mint-0x45d1ed7b.json';
import erc721Mint0x35f54999 from './test/transactions/erc721Mint-0x35f54999.json';
// token transfer
import tokenTransfer0xcfba5dee from './test/transactions/tokenTransfer-0xcfba5dee.json';

const contextualize = makeContextualize({
  protocolContextualizer: protocolContextualizer.contextualize,
  heuristicContextualizer: heuristicContextualizer.contextualize,
});

describe('ContextualizerService', () => {
  describe('Detect transactions correctly', () => {
    it('Should detect Contract Deployment', async () => {
      const contractDeployed1 = await contextualize(
        contractDeployed0x88e7d866 as Transaction,
      );
      expect(contractDeployed1.context.summaries.en.title).toBe(
        'Contract Deployed',
      );
    });

    it('Should detect ERC20 Swap', async () => {
      const erc20Swap1 = await contextualize(
        erc20Swap0x8cb66698 as Transaction,
      );
      expect(erc20Swap1.context.summaries.en.title).toBe('ERC20 Swap');

      const erc20Swap2 = await contextualize(
        erc20Swap0xd55dc9b2 as Transaction,
      );
      expect(erc20Swap2.context.summaries.en.title).toBe('ERC20 Swap');
    });

    it('Should detect ERC721 Purchase', async () => {
      const erc721Purchase1 = await contextualize(
        erc721Purchase0x2558f104 as Transaction,
      );
      expect(erc721Purchase1.context.summaries.en.title).toBe('NFT Purchase');
    });

    it('Should detect ERC721 Sale', async () => {
      const erc721Sale1 = await contextualize(
        erc721Sale0x05b8cee6 as Transaction,
      );
      expect(erc721Sale1.context.summaries.en.title).toBe('NFT Purchase'); // TODO; This should be NFT Sale, update with new version
    });

    it('Should detect ERC1155 Purchase', async () => {
      const erc1155Purchase1 = await contextualize(
        erc1155Purchase0x156df9f7 as Transaction,
      );
      expect(erc1155Purchase1.context.summaries.en.title).toBe('NFT Purchase');
    });

    it('Should detect ERC1155 Sale', async () => {
      const erc1155Sale1 = await contextualize(
        erc1155Sale0x16b2334d as Transaction,
      );
      expect(erc1155Sale1.context.summaries.en.title).toBe('NFT Purchase'); // TODO; This should be NFT Sale, update with new version
    });

    it('Should detect IDM', async () => {
      const idm1 = await contextualize(idm0xf07ff1ad as Transaction);
      expect(idm1.context.summaries.en.title).toBe('Input Data Message');
    });

    it('Should detect Token Airdrop', async () => {
      const tokenAirdrop1 = await contextualize(
        tokenAirdrop0x9559fbd9 as Transaction,
      );
      expect(tokenAirdrop1.context.summaries.en.title).toBe('Token Airdrop');

      const tokenAirdrop2 = await contextualize(
        tokenAirdrop0xe2a9a20b as Transaction,
      );
      expect(tokenAirdrop2.context.summaries.en.title).toBe('Token Airdrop');

      const tokenAirdrop3 = await contextualize(
        tokenAirdrop0xb312ecc2 as Transaction,
      );
      expect(tokenAirdrop3.context.summaries.en.title).toBe('Token Airdrop');
    });

    it('Should detect Token Approval', async () => {
      const tokenApproval1 = await contextualize(
        tokenApproval0x567130ba as Transaction,
      );
      expect(tokenApproval1.context.summaries.en.title).toBe('Token Approval');

      const tokenApproval2 = await contextualize(
        tokenApproval0x06f15d49 as Transaction,
      );
      expect(tokenApproval2.context.summaries.en.title).toBe('Token Approval');

      const tokenApproval3 = await contextualize(
        tokenApproval0xa0c2a425 as Transaction,
      );
      expect(tokenApproval3.context.summaries.en.title).toBe('Token Approval');
    });

    it('Should detect ERC721 Mint', async () => {
      const erc721Mint1 = await contextualize(
        erc721MintMint0x2c8a3ed1 as Transaction,
      );
      expect(erc721Mint1.context.summaries.en.title).toBe('NFT Mint');

      const erc721Mint2 = await contextualize(
        erc721Mint0x35f54999 as Transaction,
      );
      expect(erc721Mint2.context.summaries.en.title).toBe('NFT Mint');
    });

    it('Should detect ERC1155 Mint', async () => {
      const erc1155Mint1 = await contextualize(
        erc1155Mint0x45d1ed7b as Transaction,
      );
      expect(erc1155Mint1.context.summaries.en.title).toBe('NFT Mint');
    });

    it('Should detect Token Transfer', async () => {
      const tokenTransfer1 = await contextualize(
        tokenTransfer0xcfba5dee as Transaction,
      );
      expect(tokenTransfer1.context.summaries.en.title).toBe('Token Transfer');
    });
  });
});

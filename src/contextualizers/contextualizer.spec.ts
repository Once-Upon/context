import { contextualizer } from './index';
import { Transaction } from '../types';

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
import erc1155Mint0xdb571cc5 from './test/transactions/erc1155Mint-0xdb571cc5.json';
// token transfer
import tokenTransfer0xcfba5dee from './test/transactions/tokenTransfer-0xcfba5dee.json';
// FriendTech
import friendTech0xde5ce243 from './test/transactions/friendTech-0xde5ce243.json';
import friendTech0xe65b4bd6 from './test/transactions/friendTech-0xe65b4bd6.json';
import friendTech0xed2dd79e from './test/transactions/friendTech-0xed2dd79e.json';
import friendTech0x703647d1 from './test/transactions/friendTech-0x703647d1.json';
// cryptopunks
import cryptopunks0x3f68294b from './test/transactions/cryptopunks-0x3f68294b.json';
import cryptopunks0xd0d8cbaa from './test/transactions/cryptopunks-0xd0d8cbaa.json';
// ENS
import ens0xdb203e93 from './test/transactions/ens-0xdb203e93.json';
import ens0xea1b4ab6 from './test/transactions/ens-0xea1b4ab6.json';
import ensRegistrar0xb14b4771 from './test/transactions/ensRegistrar-0xb14b4771.json';
import ensBulkRenew0x25add712 from './test/transactions/ensBulkRenew-0x25add712.json';
// Skyoneer
import skyoneerPlotAction0x9436b659 from './test/transactions/skyoneerPlotAction-0x9436b659.json';
import skyoneerPlotAction0x9bb5a737 from './test/transactions/skyoneerPlotAction-0x9bb5a737.json';
import skyoneerPlotAction0x496c6309 from './test/transactions/skyoneerPlotAction-0x496c6309.json';
// untransformed transactions
import registrarWithConfigRaw0x5d31a49e from './test/transactions/registrarWithConfig-raw-0x5d31a49e.json';
import ensRegistrarRaw0xb14b4771 from './test/transactions/ensRegistrar-raw-0xb14b4771.json';
import nftMintRaw0xf264bbc2685 from './test/transactions/nft-mint-raw-0xf264bbc2685.json';

describe('ContextualizerService', () => {
  describe('Detect transactions correctly', () => {
    it('Should detect Contract Deployment', async () => {
      const contractDeployed1 = contextualizer.contextualize(
        contractDeployed0x88e7d866 as unknown as Transaction,
      );
      expect(contractDeployed1.context?.summaries?.en.title).toBe(
        'Contract Deployed',
      );
    });

    it('Should detect ERC20 Swap', async () => {
      const erc20Swap1 = contextualizer.contextualize(
        erc20Swap0x8cb66698 as unknown as Transaction,
      );
      expect(erc20Swap1.context?.summaries?.en.title).toBe('ERC20 Swap');

      const erc20Swap2 = contextualizer.contextualize(
        erc20Swap0xd55dc9b2 as unknown as Transaction,
      );
      expect(erc20Swap2.context?.summaries?.en.title).toBe('ERC20 Swap');
    });

    it('Should detect ERC721 Purchase', async () => {
      const erc721Purchase1 = contextualizer.contextualize(
        erc721Purchase0x2558f104 as unknown as Transaction,
      );
      expect(erc721Purchase1.context?.summaries?.en.title).toBe('NFT Purchase');
    });

    it('Should detect ERC721 Purchase', async () => {
      const erc721Sale1 = contextualizer.contextualize(
        erc721Sale0x05b8cee6 as unknown as Transaction,
      );
      expect(erc721Sale1.context?.summaries?.en.title).toBe('NFT Purchase');
    });

    it('Should detect ERC1155 Purchase', async () => {
      const erc1155Purchase1 = contextualizer.contextualize(
        erc1155Purchase0x156df9f7 as unknown as Transaction,
      );
      expect(erc1155Purchase1.context?.summaries?.en.title).toBe(
        'NFT Purchase',
      );
    });

    it('Should detect ERC1155 Purchase', async () => {
      const erc1155Sale1 = contextualizer.contextualize(
        erc1155Sale0x16b2334d as unknown as Transaction,
      );
      expect(erc1155Sale1.context?.summaries?.en.title).toBe('NFT Purchase');
    });

    it('Should detect IDM', async () => {
      const idm1 = contextualizer.contextualize(
        idm0xf07ff1ad as unknown as Transaction,
      );
      expect(idm1.context?.summaries?.en.title).toBe('Input Data Message');
    });

    it('Should detect Token Airdrop', async () => {
      const tokenAirdrop1 = contextualizer.contextualize(
        tokenAirdrop0x9559fbd9 as unknown as Transaction,
      );
      expect(tokenAirdrop1.context?.summaries?.en.title).toBe('Token Airdrop');

      const tokenAirdrop2 = contextualizer.contextualize(
        tokenAirdrop0xe2a9a20b as unknown as Transaction,
      );
      expect(tokenAirdrop2.context?.summaries?.en.title).toBe('Token Airdrop');

      const tokenAirdrop3 = contextualizer.contextualize(
        tokenAirdrop0xb312ecc2 as unknown as Transaction,
      );
      expect(tokenAirdrop3.context?.summaries?.en.title).toBe('Token Airdrop');
    });

    it('Should detect Token Approval', async () => {
      const tokenApproval1 = contextualizer.contextualize(
        tokenApproval0x567130ba as unknown as Transaction,
      );
      expect(tokenApproval1.context?.summaries?.en.title).toBe(
        'Token Approval',
      );

      const tokenApproval2 = contextualizer.contextualize(
        tokenApproval0x06f15d49 as unknown as Transaction,
      );
      expect(tokenApproval2.context?.summaries?.en.title).toBe(
        'Token Approval',
      );

      const tokenApproval3 = contextualizer.contextualize(
        tokenApproval0xa0c2a425 as unknown as Transaction,
      );
      expect(tokenApproval3.context?.summaries?.en.title).toBe(
        'Token Approval',
      );
    });

    it('Should detect ERC721 Mint', async () => {
      const erc721Mint1 = contextualizer.contextualize(
        erc721MintMint0x2c8a3ed1 as unknown as Transaction,
      );
      expect(erc721Mint1.context?.summaries?.en.title).toBe('NFT Mint');

      const erc721Mint2 = contextualizer.contextualize(
        erc721Mint0x35f54999 as unknown as Transaction,
      );
      expect(erc721Mint2.context?.summaries?.en.title).toBe('NFT Mint');
    });

    it('Should detect ERC1155 Mint', async () => {
      const erc1155Mint1 = contextualizer.contextualize(
        erc1155Mint0x45d1ed7b as unknown as Transaction,
      );
      expect(erc1155Mint1.context?.summaries?.en.title).toBe('NFT Mint');

      const erc1155Mint2 = contextualizer.contextualize(
        erc1155Mint0xdb571cc5 as unknown as Transaction,
      );
      expect(erc1155Mint2.context?.summaries?.en.title).toBe('NFT Mint');
    });

    it('Should detect Token Transfer', async () => {
      const tokenTransfer1 = contextualizer.contextualize(
        tokenTransfer0xcfba5dee as unknown as Transaction,
      );
      expect(tokenTransfer1.context?.summaries?.en.title).toBe(
        'Token Transfer',
      );
    });

    it('Should detect FriendTech transaction', () => {
      const friendTech1 = contextualizer.contextualize(
        friendTech0xde5ce243 as unknown as Transaction,
      );
      expect(friendTech1.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech2 = contextualizer.contextualize(
        friendTech0xe65b4bd6 as unknown as Transaction,
      );
      expect(friendTech2.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech3 = contextualizer.contextualize(
        friendTech0xed2dd79e as unknown as Transaction,
      );
      expect(friendTech3.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech4 = contextualizer.contextualize(
        friendTech0x703647d1 as unknown as Transaction,
      );
      expect(friendTech4.context?.summaries?.en.title).toBe('friend.tech');
    });

    it('should detect cryptopunks', () => {
      const cryptopunks1 = contextualizer.contextualize(
        cryptopunks0x3f68294b as unknown as Transaction,
      );
      expect(cryptopunks1.context?.summaries?.en.title).toBe('CryptoPunks');

      const cryptopunks2 = contextualizer.contextualize(
        cryptopunks0xd0d8cbaa as unknown as Transaction,
      );
      expect(cryptopunks2.context?.summaries?.en.title).toBe('CryptoPunks');
    });

    it('Should detect ENS transaction', () => {
      const register1 = contextualizer.contextualize(
        ens0xdb203e93 as unknown as Transaction,
      );
      expect(register1.context?.summaries?.en.title).toBe('ENS');

      const register2 = contextualizer.contextualize(
        ens0xea1b4ab6 as unknown as Transaction,
      );
      expect(register2.context?.summaries?.en.title).toBe('ENS');

      const ens3 = contextualizer.contextualize(
        ensRegistrar0xb14b4771 as unknown as Transaction,
      );
      expect(ens3.context?.summaries?.en.title).toBe('ENS');

      // bulk renew
      const bulkRenew = contextualizer.contextualize(
        ensBulkRenew0x25add712 as unknown as Transaction,
      );
      expect(bulkRenew.context?.summaries?.en.title).toBe('ENS');
    });

    it('Should detect Skyoneer', () => {
      const plotAction1 = contextualizer.contextualize(
        skyoneerPlotAction0x9436b659 as unknown as Transaction,
      );
      expect(plotAction1.context?.summaries?.en.title).toBe('Skyoneer');

      const plotAction2 = contextualizer.contextualize(
        skyoneerPlotAction0x9bb5a737 as unknown as Transaction,
      );
      expect(plotAction2.context?.summaries?.en.title).toBe('Skyoneer');

      const plotAction3 = contextualizer.contextualize(
        skyoneerPlotAction0x496c6309 as unknown as Transaction,
      );
      expect(plotAction3.context?.summaries?.en.title).toBe('Skyoneer');
    });

    it('Should detect raw transactions', () => {
      const ens1 = contextualizer.contextualize(
        ensRegistrarRaw0xb14b4771 as unknown as Transaction,
      );
      expect(ens1.context?.summaries?.en.title).toBe('ENS');

      const ens2 = contextualizer.contextualize(
        registrarWithConfigRaw0x5d31a49e as unknown as Transaction,
      );
      expect(ens2.context?.summaries?.en.title).toBe('ENS');

      const nftMint1 = contextualizer.contextualize(
        nftMintRaw0xf264bbc2685 as unknown as Transaction,
      );
      expect(nftMint1.context?.summaries?.en.title).toBe('NFT Mint');
    });
  });
});

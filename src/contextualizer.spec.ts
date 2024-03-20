import { makeContextualize } from './helpers/utils';
import { protocolContextualizer } from './protocol';
import { heuristicContextualizer } from './heuristics';
import { bridgeContextualizer } from './bridges';
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
import erc1155Mint0xdb571cc5 from './test/transactions/erc1155Mint-0xdb571cc5.json';
// token transfer
import tokenTransfer0xcfba5dee from './test/transactions/tokenTransfer-0xcfba5dee.json';
// FriendTech
import friendTech0xde5ce243 from './test/transactions/friendTech-0xde5ce243.json';
import friendTech0xe65b4bd6 from './test/transactions/friendTech-0xe65b4bd6.json';
import friendTech0xed2dd79e from './test/transactions/friendTech-0xed2dd79e.json';
import friendTech0x703647d1 from './test/transactions/friendTech-0x703647d1.json';
// ENS
import ens0xdb203e93 from './test/transactions/ens-0xdb203e93.json';
import ens0xea1b4ab6 from './test/transactions/ens-0xea1b4ab6.json';
import ensRegistrar0xb14b4771 from './test/transactions/ensRegistrar-0xb14b4771.json';
import ensBulkRenew0x25add712 from './test/transactions/ensBulkRenew-0x25add712.json';

const contextualize = makeContextualize({
  protocolContextualizer: protocolContextualizer.contextualize,
  heuristicContextualizer: heuristicContextualizer.contextualize,
  bridgeContextualizer: bridgeContextualizer.contextualize,
});

describe('ContextualizerService', () => {
  describe('Detect transactions correctly', () => {
    it('Should detect Contract Deployment', async () => {
      const contractDeployed1 = contextualize(
        contractDeployed0x88e7d866 as Transaction,
      );
      expect(contractDeployed1.context?.summaries?.en.title).toBe(
        'Contract Deployed',
      );
    });

    it('Should detect ERC20 Swap', async () => {
      const erc20Swap1 = contextualize(erc20Swap0x8cb66698 as Transaction);
      expect(erc20Swap1.context?.summaries?.en.title).toBe('ERC20 Swap');

      const erc20Swap2 = contextualize(erc20Swap0xd55dc9b2 as Transaction);
      expect(erc20Swap2.context?.summaries?.en.title).toBe('ERC20 Swap');
    });

    it('Should detect ERC721 Purchase', async () => {
      const erc721Purchase1 = contextualize(
        erc721Purchase0x2558f104 as Transaction,
      );
      expect(erc721Purchase1.context?.summaries?.en.title).toBe('NFT Purchase');
    });

    it('Should detect ERC721 Sale', async () => {
      const erc721Sale1 = contextualize(erc721Sale0x05b8cee6 as Transaction);
      expect(erc721Sale1.context?.summaries?.en.title).toBe('NFT Purchase'); // TODO; This should be NFT Sale, update with new version
    });

    it('Should detect ERC1155 Purchase', async () => {
      const erc1155Purchase1 = contextualize(
        erc1155Purchase0x156df9f7 as Transaction,
      );
      expect(erc1155Purchase1.context?.summaries?.en.title).toBe(
        'NFT Purchase',
      );
    });

    it('Should detect ERC1155 Sale', async () => {
      const erc1155Sale1 = contextualize(erc1155Sale0x16b2334d as Transaction);
      expect(erc1155Sale1.context?.summaries?.en.title).toBe('NFT Purchase'); // TODO; This should be NFT Sale, update with new version
    });

    it('Should detect IDM', async () => {
      const idm1 = contextualize(idm0xf07ff1ad as Transaction);
      expect(idm1.context?.summaries?.en.title).toBe('Input Data Message');
    });

    it('Should detect Token Airdrop', async () => {
      const tokenAirdrop1 = contextualize(
        tokenAirdrop0x9559fbd9 as Transaction,
      );
      expect(tokenAirdrop1.context?.summaries?.en.title).toBe('Token Airdrop');

      const tokenAirdrop2 = contextualize(
        tokenAirdrop0xe2a9a20b as Transaction,
      );
      expect(tokenAirdrop2.context?.summaries?.en.title).toBe('Token Airdrop');

      const tokenAirdrop3 = contextualize(
        tokenAirdrop0xb312ecc2 as Transaction,
      );
      expect(tokenAirdrop3.context?.summaries?.en.title).toBe('Token Airdrop');
    });

    it('Should detect Token Approval', async () => {
      const tokenApproval1 = contextualize(
        tokenApproval0x567130ba as Transaction,
      );
      expect(tokenApproval1.context?.summaries?.en.title).toBe(
        'Token Approval',
      );

      const tokenApproval2 = contextualize(
        tokenApproval0x06f15d49 as Transaction,
      );
      expect(tokenApproval2.context?.summaries?.en.title).toBe(
        'Token Approval',
      );

      const tokenApproval3 = contextualize(
        tokenApproval0xa0c2a425 as Transaction,
      );
      expect(tokenApproval3.context?.summaries?.en.title).toBe(
        'Token Approval',
      );
    });

    it('Should detect ERC721 Mint', async () => {
      const erc721Mint1 = contextualize(
        erc721MintMint0x2c8a3ed1 as Transaction,
      );
      expect(erc721Mint1.context?.summaries?.en.title).toBe('NFT Mint');

      const erc721Mint2 = contextualize(erc721Mint0x35f54999 as Transaction);
      expect(erc721Mint2.context?.summaries?.en.title).toBe('NFT Mint');
    });

    it('Should detect ERC1155 Mint', async () => {
      const erc1155Mint1 = contextualize(erc1155Mint0x45d1ed7b as Transaction);
      expect(erc1155Mint1.context?.summaries?.en.title).toBe('NFT Mint');

      const erc1155Mint2 = contextualize(erc1155Mint0xdb571cc5 as Transaction);
      expect(erc1155Mint2.context?.summaries?.en.title).toBe('NFT Mint');
    });

    it('Should detect Token Transfer', async () => {
      const tokenTransfer1 = contextualize(
        tokenTransfer0xcfba5dee as Transaction,
      );
      expect(tokenTransfer1.context?.summaries?.en.title).toBe(
        'Token Transfer',
      );
    });

    it('Should detect FriendTech transaction', () => {
      const friendTech1 = contextualize(friendTech0xde5ce243 as Transaction);
      expect(friendTech1.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech2 = contextualize(friendTech0xe65b4bd6 as Transaction);
      expect(friendTech2.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech3 = contextualize(friendTech0xed2dd79e as Transaction);
      expect(friendTech3.context?.summaries?.en.title).toBe('friend.tech');

      const friendTech4 = contextualize(friendTech0x703647d1 as Transaction);
      expect(friendTech4.context?.summaries?.en.title).toBe('friend.tech');
    });

    it('Should detect ENS transaction', () => {
      const register1 = contextualize(ens0xdb203e93 as Transaction);
      expect(register1.context?.summaries?.en.title).toBe('ENS');

      const register2 = contextualize(ens0xea1b4ab6 as Transaction);
      expect(register2.context?.summaries?.en.title).toBe('ENS');

      const ens3 = contextualize(ensRegistrar0xb14b4771 as Transaction);
      expect(ens3.context?.summaries?.en.title).toBe('ENS');

      // bulk renew
      const bulkRenew = contextualize(ensBulkRenew0x25add712 as Transaction);
      expect(bulkRenew.context?.summaries?.en.title).toBe('ENS');
    });
  });
});

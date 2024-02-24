import { makeContextualize } from './helpers/utils';
import { protocolContextualizer } from './protocol';
import { heuristicContextualizer } from './heuristics';
import { Transaction } from './types';
import { unpackERC4337Transactions } from './accountAbstraction';

import simpleAccountErc20Transfer0x6ae53f78 from './test/transactions/erc4337-simpleaccount-erc20-transfer-0x6ae53f78.json';
import approve0x366e021f from './test/transactions/erc4337-approve-0x366e021f.json';
import unknownMint0x7e982185 from './test/transactions/erc4337-unknown-mint-0x7e982185.json';
import okxEthTransfer0x7a5e9ca7 from './test/transactions/erc4337-okx-eth-transfer-0x7a5e9ca7.json';

const contextualize = makeContextualize({
  protocolContextualizer: protocolContextualizer.contextualize,
  heuristicContextualizer: heuristicContextualizer.contextualize,
});

describe('ContextualizerService', () => {
  describe('SimpleAccount accounts', () => {
    it('Should detect ERC20 token transfer', () => {
      const txn = simpleAccountErc20Transfer0x6ae53f78 as Transaction;

      const withoutUnpacking = contextualize({ ...txn });
      expect(withoutUnpacking.context).toBeUndefined();

      const withUnpacking = contextualize(
        unpackERC4337Transactions({ ...txn })[0],
      );
      expect(withUnpacking.isERC4337Transaction).toBe(true);
      expect(withUnpacking.ERC4337Info?.bundler).toBe(
        '0xa5fdfcbceeceb5741ef73f86cf3ed6e80e5e920d',
      );
      expect(withUnpacking.context?.summaries?.en.title).toBe('Token Transfer');
    });
  });

  describe('OKX style accounts', () => {
    it('Should detect eth transfer', () => {
      const txn = okxEthTransfer0x7a5e9ca7 as Transaction;
      const withoutUnpacking = contextualize({
        ...txn,
      });
      expect(withoutUnpacking.context).toBeUndefined();

      const withUnpacking = contextualize(
        unpackERC4337Transactions({ ...txn })[0],
      );
      expect(withUnpacking.isERC4337Transaction).toBe(true);
      expect(withUnpacking.ERC4337Info?.bundler).toBe(
        '0x12a39672ae8ae8e87e12a5de53c34690d830365c',
      );
      expect(withUnpacking.context?.summaries?.en.title).toBe('ETH Transfer');
    });
  });

  describe('Unknown accounts', () => {
    it('Should detect token approval', () => {
      const txn = approve0x366e021f as Transaction;

      const withoutUnpacking = contextualize({
        ...txn,
      });
      expect(withoutUnpacking.context).toBeUndefined();

      const withUnpacking = contextualize(
        unpackERC4337Transactions({ ...txn })[0],
      );
      expect(withUnpacking.isERC4337Transaction).toBe(true);
      expect(withUnpacking.ERC4337Info?.bundler).toBe(
        '0xfd72ae8ff5cc18849d83f13a252a0d8fd99eb0ac',
      );
      expect(withUnpacking.context?.summaries?.en.title).toBe('Token Approval');
    });

    it('Should detect NFT mints', () => {
      const txn = unknownMint0x7e982185 as Transaction;

      // NOTE(datadanne): The mint contextualizer only looks at token transfers so
      // it detects a mint even if it isn't unpacked, but sets an incorrect sender
      const withoutUnpacking = contextualize({ ...txn });
      expect(withoutUnpacking.context?.variables?.sender['value']).not.toBe(
        withoutUnpacking.context?.variables?.recipient['value'],
      );

      const withUnpacking = contextualize(
        unpackERC4337Transactions({ ...txn })[0],
      );
      expect(withUnpacking.isERC4337Transaction).toBe(true);
      expect(withUnpacking.ERC4337Info?.bundler).toBe(
        '0x4a25d28d10b02bcf13a16068f56d167d8f96d093',
      );
      expect(withUnpacking.context?.summaries?.en.title).toBe('NFT Mint');
      expect(withUnpacking.context?.variables?.sender['value']).toBe(
        withUnpacking.context?.variables?.recipient['value'],
      );
    });
  });
});

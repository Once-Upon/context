import { zeroAddress } from 'viem';
import {
  computeERC20Price,
  computeETHPrice,
  processAssetTransfers,
} from '../../../helpers/utils';
import {
  AssetType,
  ERC20Asset,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isERC1155Purchase = detect(transaction);
  if (!isERC1155Purchase) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */

  if (!transaction.netAssetTransfers || !transaction.assetTransfers)
    return false;

  const addresses = transaction.netAssetTransfers
    ? Object.keys(transaction.netAssetTransfers)
    : [];

  for (const address of addresses) {
    const transfers = transaction.netAssetTransfers[address];
    const nftsReceived = transfers?.received.filter(
      (t) => t.type === AssetType.ERC1155,
    );
    const nftsSent = transfers?.sent.filter(
      (t) => t.type === AssetType.ERC1155,
    );

    const ethOrErc20Sent = transfers?.sent.filter(
      (t) => t.type === AssetType.ETH || t.type === AssetType.ERC20,
    );
    const ethOrErc20Received = transfers?.received.filter(
      (t) => t.type === AssetType.ETH || t.type === AssetType.ERC20,
    );

    if (
      nftsReceived &&
      nftsReceived.length > 0 &&
      ethOrErc20Sent &&
      ethOrErc20Sent.length > 0
    ) {
      const { receivingAddresses } = processAssetTransfers(
        transaction.netAssetTransfers,
        transaction.assetTransfers,
      );
      if (receivingAddresses[0] !== zeroAddress) return true;
    }

    if (
      nftsSent &&
      nftsSent.length > 0 &&
      ethOrErc20Received &&
      ethOrErc20Received.length > 0
    ) {
      const { receivingAddresses } = processAssetTransfers(
        transaction.netAssetTransfers,
        transaction.assetTransfers,
      );
      if (receivingAddresses[0] !== zeroAddress) return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers || !transaction.netAssetTransfers) {
    return transaction;
  }

  const {
    receivingAddresses,
    sendingAddresses,
    receivedNfts,
    receivedNftContracts,
    erc20Payments,
    ethPayments,
  } = processAssetTransfers(
    transaction.netAssetTransfers,
    transaction.assetTransfers,
  );

  const totalERC20Payment: Record<string, ERC20Asset> = computeERC20Price(
    erc20Payments,
    receivingAddresses,
  );
  const totalETHPayment = computeETHPrice(ethPayments, receivingAddresses);
  const totalAssets =
    Object.keys(totalERC20Payment).length +
    (totalETHPayment > BigInt(0) ? 1 : 0);

  transaction.context = {
    actions: [HeuristicContextActionEnum.BOUGHT],

    variables: {
      userOrUsers:
        receivingAddresses.length > 1
          ? {
              type: 'number',
              value: receivingAddresses.length,
              emphasis: true,
              unit: 'users',
            }
          : {
              type: 'address',
              value: receivingAddresses[0],
            },
      tokenOrTokens:
        receivedNfts.length === 1 && receivedNfts[0].type === AssetType.ERC1155
          ? {
              type: AssetType.ERC1155,
              token: receivedNfts[0].contract,
              tokenId: receivedNfts[0].tokenId,
              value: receivedNfts[0].value,
            }
          : receivedNftContracts.length === 1
          ? {
              type: 'address',
              value: receivedNftContracts[0],
            }
          : {
              type: 'number',
              value: receivedNfts.length,
              emphasis: true,
              unit: 'NFTs',
            },
      price:
        totalAssets > 1
          ? {
              type: 'number',
              value: totalAssets,
              emphasis: true,
              unit: 'assets',
            }
          : ethPayments.length > 0
          ? {
              type: AssetType.ETH,
              value: totalETHPayment.toString(),
              unit: 'wei',
            }
          : {
              type: AssetType.ERC20,
              token: Object.values(totalERC20Payment)[0].contract,
              value: Object.values(totalERC20Payment)[0].value.toString(),
            },
      sellerOrSellers:
        sendingAddresses.length > 1
          ? {
              type: 'number',
              value: sendingAddresses.length,
              emphasis: true,
              unit: 'users',
            }
          : {
              type: 'address',
              value: sendingAddresses[0],
            },
      bought: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BOUGHT,
        value: HeuristicContextActionEnum.BOUGHT,
      },
    },

    summaries: {
      category: 'NFT',
      en: {
        title: 'NFT Purchase',
        default:
          '[[userOrUsers]][[bought]][[tokenOrTokens]]for[[price]]from[[sellerOrSellers]]',
      },
    },
  };

  return transaction;
}

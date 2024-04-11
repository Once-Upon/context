import {
  computeERC20Price,
  computeETHPrice,
  processNetAssetTransfers,
} from '../../../helpers/utils';
import {
  AssetType,
  ERC20Asset,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isERC1155Sale = detect(transaction);
  if (!isERC1155Sale) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * A tx is an ERC1155 sale when the tx.from sends and receives exactly 1 asset (look at netAssetTransfers).
 * The tx.from must send exactly 1 ERC1155, where the value (special to 1155s) can be arbitrary
 * The tx.from must receive either ETH/WETH/Blur ETH
 * There are no other recipients of ERC721/ERC20s/ERC1155s.
 */
export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   * and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */

  if (!transaction.netAssetTransfers) return false;

  // check if transfer.from sent and received one asset
  const transfers = transaction.netAssetTransfers[transaction.from];
  const nftsSent = transfers?.sent.filter((t) => t.type === AssetType.ERC1155);
  const tokenReceived = transfers?.received.filter(
    (t) => t.type === AssetType.ETH || t.type === AssetType.ERC20,
  );

  if (!nftsSent || !tokenReceived) return false;
  if (nftsSent.length > 0 && tokenReceived.length > 0) {
    return true;
  }

  return false;
}

function generate(transaction: Transaction): Transaction {
  if (!transaction.netAssetTransfers) {
    return transaction;
  }

  const {
    receivingAddresses,
    receivedNfts,
    receivedNftContracts,
    erc20Payments,
    ethPayments,
  } = processNetAssetTransfers(transaction.netAssetTransfers);

  const totalERC20Payment: Record<string, ERC20Asset> =
    computeERC20Price(erc20Payments);
  const totalETHPayment = computeETHPrice(ethPayments);
  const totalAssets = erc20Payments.length + ethPayments.length;

  transaction.context = {
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
              value: Object.values(totalERC20Payment)[0].value,
            },
      bought: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.BOUGHT,
      },
    },
    summaries: {
      category: 'NFT',
      en: {
        title: 'NFT Purchase',
        default: '[[userOrUsers]][[bought]][[tokenOrTokens]]for[[price]]',
      },
    },
  };

  return transaction;
}

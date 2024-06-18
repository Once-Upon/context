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
  const isERC721PurchaseTransaction = detect(transaction);

  if (!isERC721PurchaseTransaction) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * Transaction.from sends ETH/WETH/blur eth and receives only NFTs.
 * Nothing is minted (exception being weth)
 * In netAssetTransfers, the address that sent the NFTs receives either eth/weth/blur eth.
 * The rest of the parties only receive eth/weth/blur eth (royalties/fees)
 */
export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (!transaction.netAssetTransfers || !transaction.assetTransfers)
    return false;

  // check if nft receiver sent some eth or erc20
  for (const address in transaction.netAssetTransfers) {
    const transfers = transaction.netAssetTransfers[address];
    const nftsReceived = transfers?.received.filter(
      (t) => t.type === AssetType.ERC721,
    );
    const tokenSent = transfers?.sent.filter(
      (t) => t.type === AssetType.ETH || t.type === AssetType.ERC20,
    );
    if (
      nftsReceived &&
      nftsReceived.length > 0 &&
      tokenSent &&
      tokenSent.length > 0
    ) {
      const { receivingAddresses } = processAssetTransfers(
        transaction.netAssetTransfers,
        transaction.assetTransfers,
      );
      if (receivingAddresses[0] !== zeroAddress) return true;
    }

    const nftsSent = transfers?.sent.filter((t) => t.type === AssetType.ERC721);
    const tokenReceived = transfers?.received.filter(
      (t) => t.type === AssetType.ETH || t.type === AssetType.ERC20,
    );
    if (
      nftsSent &&
      nftsSent.length > 0 &&
      tokenReceived &&
      tokenReceived.length > 0
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
        receivedNfts.length === 1 && receivedNfts[0].type === AssetType.ERC721
          ? {
              type: AssetType.ERC721,
              token: receivedNfts[0].contract,
              tokenId: receivedNfts[0].tokenId,
            }
          : receivedNftContracts.length === 1 ||
            receivedNftContracts.every(
              (contract) => contract === receivedNfts[0].contract,
            )
          ? {
              type: 'address',
              value: receivedNfts[0].contract,
            }
          : {
              type: 'string',
              value: 'NFTs',
              emphasis: true,
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

  if (receivedNfts.length > 1) {
    transaction.context.variables = {
      ...transaction.context.variables,
      numOfToken: {
        type: 'number',
        value: receivedNfts.length,
        emphasis: true,
      },
    };
    transaction.context.summaries = {
      category: 'NFT',
      en: {
        title: 'NFT Purchase',
        default:
          '[[userOrUsers]][[bought]][[numOfToken]][[tokenOrTokens]]for[[price]]from[[sellerOrSellers]]',
      },
    };
  }

  return transaction;
}

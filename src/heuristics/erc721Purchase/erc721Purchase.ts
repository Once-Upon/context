import {
  AssetType,
  ERC20Asset,
  ERC721Asset,
  ETHAsset,
  Transaction,
} from '../../types';

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
  if (!transaction.netAssetTransfers) return false;

  const transfers = transaction.netAssetTransfers[transaction.from];
  const nftsReceived = transfers?.received.filter((t) => t.type === 'erc721');
  const tokenSent = transfers?.sent.filter(
    (t) => t.type === 'eth' || t.type === 'erc20',
  );

  if (!nftsReceived || !tokenSent) return false;
  if (nftsReceived.length > 0 && tokenSent.length > 0) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const receivingAddresses: string[] = [];
  let receivedNfts: ERC721Asset[] = [];
  let sentPayments: { type: string; asset: string; value: string }[] = [];

  Object.entries(transaction.netAssetTransfers).forEach(([address, data]) => {
    const nftTransfers = data.received.filter(
      (t) => t.type === AssetType.ERC721,
    ) as ERC721Asset[];
    const paymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ERC20 || t.type === AssetType.ETH,
    ) as (ERC20Asset | ETHAsset)[];
    if (nftTransfers.length > 0) {
      receivingAddresses.push(address);
      receivedNfts = [...receivedNfts, ...nftTransfers];
    }
    if (paymentTransfers.length > 0) {
      sentPayments = [
        ...sentPayments,
        ...paymentTransfers.map((payment) => ({
          type: payment.type,
          asset: payment.asset,
          value: payment.value,
        })),
      ];
    }
  });

  const totalPayments = Object.values(
    sentPayments.reduce((acc, next) => {
      acc[next.asset] = {
        type: next.type,
        asset: next.asset,
        value: (
          BigInt(acc[next.asset]?.value || '0') + BigInt(next.value)
        ).toString(),
      };
      return acc;
    }, {}),
  ) as { type: 'eth' | 'erc20'; asset: string; value: string }[];

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
        receivedNfts.length === 1
          ? {
              type: AssetType.ERC721,
              token: receivedNfts[0].asset,
              tokenId: receivedNfts[0].tokenId,
            }
          : receivedNfts.length === 1
            ? {
                type: 'address',
                value: receivedNfts[0].asset,
              }
            : {
                type: 'number',
                value: receivedNfts.length,
                emphasis: true,
                unit: 'NFTs',
              },
      price:
        totalPayments.length > 1
          ? {
              type: 'number',
              value: totalPayments.length,
              emphasis: true,
              unit: 'assets',
            }
          : totalPayments[0].type === AssetType.ETH
            ? {
                type: AssetType.ETH,
                value: totalPayments[0].value,
                unit: 'wei',
              }
            : {
                type: AssetType.ERC20,
                token: totalPayments[0].asset,
                value: totalPayments[0].value,
              },
      bought: {
        type: 'contextAction',
        value: 'BOUGHT',
      },
    },
    summaries: {
      category: 'NFT',
      en: {
        title: 'NFT Purchase',
        default: '[[userOrUsers]] [[bought]] [[tokenOrTokens]] for [[price]]',
      },
    },
  };

  return transaction;
}

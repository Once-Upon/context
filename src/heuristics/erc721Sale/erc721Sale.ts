import { ethers } from 'ethers';
import { Asset, Transaction } from '../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isERC721SaleTransaction = detect(transaction);

  if (!isERC721SaleTransaction) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * Transaction.from receives ETH/WETH/blur eth and sends only NFTs.
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
  const nftsSent = transfers?.sent.filter((t) => t.type === 'erc721');
  const tokenReceived = transfers?.received.filter(
    (t) => t.type === 'eth' || t.type === 'erc20',
  );

  if (!nftsSent || !tokenReceived) return false;
  if (nftsSent.length > 0 && tokenReceived.length > 0) {
    return true;
  }

  return false;
}

function generate(transaction: Transaction): Transaction {
  const receivingAddresses: string[] = [];
  const receivedNfts: Asset[] = [];
  const sentPayments: { type: string; asset: string; value: string }[] = [];

  for (const [address, data] of Object.entries(transaction.netAssetTransfers)) {
    const nftTransfers = data.received.filter((t) => t.type === 'erc721');
    const paymentTransfers = data.sent.filter(
      (t) => t.type === 'erc20' || t.type === 'eth',
    );
    if (nftTransfers.length > 0) {
      receivingAddresses.push(address);
      nftTransfers.forEach((nft) => receivedNfts.push(nft));
    }
    if (paymentTransfers.length > 0) {
      paymentTransfers.forEach((payment) =>
        sentPayments.push({
          type: payment.type,
          asset: payment.asset,
          value: payment.value,
        }),
      );
    }
  }

  const receivedNftContracts = Array.from(
    new Set(receivedNfts.map((x) => x.asset)),
  );
  const totalPayments = Object.values(
    sentPayments.reduce((acc, next) => {
      acc[next.asset] = {
        type: next.type,
        asset: next.asset,
        value: ethers.BigNumber.from(acc[next.asset]?.value || '0')
          .add(next.value)
          .toString(),
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
              type: 'erc721',
              token: receivedNfts[0].asset,
              tokenId: receivedNfts[0].tokenId,
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
        totalPayments.length > 1
          ? {
              type: 'number',
              value: totalPayments.length,
              emphasis: true,
              unit: 'assets',
            }
          : totalPayments[0].type === 'eth'
            ? {
                type: 'eth',
                value: totalPayments[0].value,
                unit: 'wei',
              }
            : {
                type: 'erc20',
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

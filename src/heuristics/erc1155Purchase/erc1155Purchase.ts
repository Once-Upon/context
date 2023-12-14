import { Asset, Transaction } from '../../types';

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

  if (!transaction.netAssetTransfers) return false;

  const addresses = transaction.netAssetTransfers
    ? Object.keys(transaction.netAssetTransfers)
    : [];

  for (const address of addresses) {
    const transfers = transaction.netAssetTransfers[address];
    const nftsReceived = transfers?.received.filter(
      (t) => t.type === 'erc1155',
    );
    const nftsSent = transfers?.sent.filter((t) => t.type === 'erc1155');

    const ethOrErc20Sent = transfers?.sent.filter(
      (t) => t.type === 'eth' || t.type === 'erc20',
    );
    const ethOrErc20Received = transfers?.received.filter(
      (t) => t.type === 'eth' || t.type === 'erc20',
    );

    if (
      nftsReceived &&
      nftsReceived.length > 0 &&
      ethOrErc20Sent &&
      ethOrErc20Sent.length > 0
    ) {
      return true;
    }

    if (
      nftsSent &&
      nftsSent.length > 0 &&
      ethOrErc20Received &&
      ethOrErc20Received.length > 0
    ) {
      return true;
    }
  }

  return false;
}

function generate(transaction: Transaction): Transaction {
  const receivingAddresses: string[] = [];
  let receivedNfts: Asset[] = [];
  let sentPayments: { type: string; asset: string; value: string }[] = [];

  Object.entries(transaction.netAssetTransfers).forEach(([address, data]) => {
    const nftTransfers = data.received.filter((t) => t.type === 'erc1155');
    const paymentTransfers = data.sent.filter(
      (t) => t.type === 'erc20' || t.type === 'eth',
    );
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
      userOrUsers: {
        type: receivingAddresses.length > 1 ? 'string' : 'address',
        value:
          receivingAddresses.length > 1
            ? `${receivingAddresses.length} Users`
            : receivingAddresses[0],
        emphasis: receivingAddresses.length > 1,
      },
      tokenOrTokens:
        receivedNfts.length === 1
          ? {
              type: 'erc1155',
              token: receivedNfts[0].asset,
              tokenId: receivedNfts[0].tokenId,
              value: receivedNfts[0].value,
            }
          : receivedNfts.length === 1
            ? {
                type: 'address',
                value: receivedNfts[0].asset,
              }
            : {
                type: 'string',
                value: `${receivedNfts.length} NFTs`,
                emphasis: true,
              },
      price:
        totalPayments.length > 1
          ? {
              type: 'string',
              value: `${totalPayments.length} Assets`,
              emphasis: true,
            }
          : totalPayments[0].type === 'eth'
            ? {
                type: 'eth',
                value: totalPayments[0].value,
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

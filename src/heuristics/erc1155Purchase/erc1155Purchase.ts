import {
  AssetType,
  ERC1155Asset,
  ERC20Asset,
  ETHAsset,
  Transaction,
} from '../../types';

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
  let receivedNfts: ERC1155Asset[] = [];
  let sentPayments: { type: string; asset: string; value: string }[] = [];

  Object.entries(transaction.netAssetTransfers).forEach(([address, data]) => {
    const nftTransfers = data.received.filter(
      (t) => t.type === AssetType.ERC1155,
    ) as ERC1155Asset[];
    const paymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ERC20 || t.type === AssetType.ETH,
    ) as (ETHAsset | ERC20Asset)[];
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
              type: AssetType.ERC1155,
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

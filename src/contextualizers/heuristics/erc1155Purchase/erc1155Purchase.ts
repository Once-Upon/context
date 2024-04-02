import { formatNativeToken } from '../../../helpers/utils';
import {
  AssetType,
  ERC1155Asset,
  ERC20Asset,
  ETHAsset,
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

  if (!transaction.netAssetTransfers) return false;

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
  if (!transaction.netAssetTransfers) {
    return transaction;
  }

  const receivingAddresses: string[] = [];
  const sendingAddresses: string[] = [];
  let receivedNfts: ERC1155Asset[] = [];
  let erc20Payments: ERC20Asset[] = [];
  let ethPayments: ETHAsset[] = [];

  Object.entries(transaction.netAssetTransfers).forEach(([address, data]) => {
    const nftsReceived = data.received.filter(
      (t) => t.type === AssetType.ERC1155,
    ) as ERC1155Asset[];
    const nftsSent = data.sent.filter(
      (t) => t.type === AssetType.ERC1155,
    ) as ERC1155Asset[];
    const erc20PaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ERC20,
    ) as ERC20Asset[];
    const ethPaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ETH,
    ) as ETHAsset[];

    if (nftsReceived.length > 0) {
      receivingAddresses.push(address);
      receivedNfts = [...receivedNfts, ...nftsReceived];
    }
    if (nftsSent.length > 0 && !sendingAddresses.includes(address)) {
      sendingAddresses.push(address);
    }
    if (erc20PaymentTransfers.length > 0) {
      erc20Payments = [
        ...erc20Payments,
        ...erc20PaymentTransfers.map((payment) => ({
          type: payment.type,
          contract: payment.contract,
          value: payment.value,
        })),
      ];
    }
    if (ethPaymentTransfers.length > 0) {
      ethPayments = [
        ...ethPayments,
        ...ethPaymentTransfers.map((payment) => ({
          type: payment.type,
          value: payment.value,
        })),
      ];
    }
  });

  const receivedNftContracts = Array.from(
    new Set(receivedNfts.map((x) => x.contract)),
  );
  const totalERC20Payment: Record<string, ERC20Asset> = erc20Payments.reduce(
    (acc, next) => {
      acc[next.contract] = {
        id: next.contract,
        type: next.type,
        contract: next.contract,
        value: (
          BigInt(acc[next.contract]?.value || '0') + BigInt(next.value)
        ).toString(),
      };
      return acc;
    },
    {},
  );

  const totalETHPayment = ethPayments.reduce((acc, next) => {
    acc = BigInt(acc) + BigInt(next.value);
    return acc;
  }, BigInt(0));
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
        receivedNfts.length === 1
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
                type: formatNativeToken(transaction.chainId ?? 1),
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
        value: 'BOUGHT',
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

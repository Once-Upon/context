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
  if (!transaction.netAssetTransfers) {
    return transaction;
  }

  const receivingAddresses: string[] = [];
  let receivedNfts: ERC721Asset[] = [];
  let erc20Payments: ERC20Asset[] = [];
  let ethPayments: ETHAsset[] = [];

  Object.entries(transaction.netAssetTransfers).forEach(([address, data]) => {
    const nftTransfers = data.received.filter(
      (t) => t.type === AssetType.ERC721,
    ) as ERC721Asset[];
    const erc20PaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ERC20,
    ) as ERC20Asset[];
    const ethPaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ETH,
    ) as ETHAsset[];

    if (nftTransfers.length > 0) {
      receivingAddresses.push(address);
      receivedNfts = [...receivedNfts, ...nftTransfers];
    }
    if (erc20PaymentTransfers.length > 0) {
      erc20Payments = [
        ...erc20Payments,
        ...erc20PaymentTransfers.map((payment) => ({
          id: payment.id,
          type: payment.type,
          asset: payment.asset,
          value: payment.value,
        })),
      ];
    }
    if (ethPaymentTransfers.length > 0) {
      ethPayments = [
        ...ethPayments,
        ...ethPaymentTransfers.map((payment) => ({
          id: payment.id,
          type: payment.type,
          value: payment.value,
        })),
      ];
    }
  });
  const receivedNftContracts = Array.from(
    new Set(receivedNfts.map((x) => x.asset)),
  );
  const totalERC20Payment: Record<string, ERC20Asset> = erc20Payments.reduce(
    (acc, next) => {
      acc[next.asset] = {
        id: next.asset,
        type: next.type,
        asset: next.asset,
        value: (
          BigInt(acc[next.asset]?.value || '0') + BigInt(next.value)
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
              type: AssetType.ERC721,
              token: receivedNfts[0].asset,
              tokenId: receivedNfts[0].tokenId,
            }
          : receivedNftContracts.length === 1 ||
              receivedNftContracts.every(
                (contract) => contract === receivedNfts[0].asset,
              )
            ? {
                type: 'address',
                value: receivedNfts[0].asset,
              }
            : {
                type: 'string',
                value: 'NFTs',
                emphasis: true,
              },
      numOfToken:
        receivedNfts.length === 1
          ? {
              type: 'string',
              value: '',
            }
          : {
              type: 'number',
              value: receivedNfts.length,
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
                token: Object.values(totalERC20Payment)[0].asset,
                value: Object.values(totalERC20Payment)[0].value,
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
          '[[userOrUsers]][[bought]][[numOfToken]][[tokenOrTokens]]for[[price]]',
      },
    },
  };

  return transaction;
}

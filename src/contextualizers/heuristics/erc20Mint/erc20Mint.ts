import {
  AssetType,
  ETHAsset,
  Transaction,
  ERC20AssetTransfer,
} from '../../../types';
import { KNOWN_ADDRESSES, WETH_ADDRESSES } from '../../../helpers/constants';
import { formatNativeToken } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isTokenMint = detect(transaction);
  if (!isTokenMint) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * 1 address receives NFTs, all must be from the same contract. All nfts are minted (meaning they're sent from null address in netAssetTransfers).
 * The from address can send ETH
 * The only other parties in netAssetTransfers are receiving ETH
 */
export function detect(transaction: Transaction): boolean {
  if (
    !transaction?.from ||
    !transaction.assetTransfers?.length ||
    !transaction.netAssetTransfers
  ) {
    return false;
  }

  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      transfer.type === AssetType.ERC20 &&
      transfer.contract &&
      !WETH_ADDRESSES.includes(transfer.contract),
  ) as ERC20AssetTransfer[];

  if (mints.length == 0) {
    return false;
  }

  // check if all minted assets are from the same contract
  const isSameContract = mints.every(
    (ele) => ele.contract === mints[0].contract,
  );
  if (!isSameContract) {
    return false;
  }
  // transfer.from can send some eth
  const assetTransfer = transaction.netAssetTransfers[transaction.from];
  const assetSent = assetTransfer?.sent ?? [];
  if (assetSent.length > 0 && assetSent[0].type !== AssetType.ETH) {
    return false;
  }
  // check if other transaction parties received ether
  const transactionParties: string[] = Object.keys(
    transaction.netAssetTransfers,
  )
    .reduce((parties, address) => {
      parties = [...new Set([...parties, address])];
      return parties;
    }, [] as string[])
    .filter(
      (address) =>
        address !== KNOWN_ADDRESSES.NULL && address !== transaction.from,
    );

  for (const address of transactionParties) {
    const assetReceived = transaction.netAssetTransfers[address]?.received;
    if (assetReceived.length === 0 || assetReceived[0].type !== AssetType.ETH) {
      return false;
    }
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers || !transaction.netAssetTransfers) {
    return transaction;
  }
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      transfer.type === AssetType.ERC20 &&
      transfer.contract &&
      !WETH_ADDRESSES.includes(transfer.contract),
  ) as ERC20AssetTransfer[];

  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer: ERC20AssetTransfer = mints[0];
  const recipient = assetTransfer.to;

  const assetSent = transaction.netAssetTransfers[transaction.from]
    ?.sent as ETHAsset[];
  const price =
    assetSent && assetSent?.length > 0 && assetSent[0]?.value
      ? assetSent[0]?.value
      : '0';

  transaction.context = {
    variables: {
      token: {
        type: AssetType.ERC20,
        token: assetTransfer.contract,
        value: assetTransfer.value,
      },
      recipient: {
        type: 'address',
        value: recipient,
      },
      price: {
        type: formatNativeToken(transaction.chainId),
        value: price,
        unit: 'wei',
      },
      minted: { type: 'contextAction', value: 'MINTED' },
    },
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'ERC20 Mint',
        default: '[[recipient]][[minted]][[token]]for[[price]]',
      },
    },
  };

  return transaction;
}

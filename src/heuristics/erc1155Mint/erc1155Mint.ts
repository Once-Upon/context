import { Transaction } from '../../types';
import { KNOWN_ADDRESSES } from '../../helpers/constants';

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
    transaction.netAssetTransfers === undefined // TODO: This is a hack because of an issue with netAssetTransfers transformer
  ) {
    return false;
  }

  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL && transfer.type === 'erc1155',
  );

  if (mints.length == 0) {
    return false;
  }

  // check if all minted assets are from the same contract
  const isSameContract = mints.every((ele) => ele.asset === mints[0].asset);
  if (!isSameContract) {
    return false;
  }
  // transfer.from can send some eth
  const assetTransfer = transaction.netAssetTransfers[transaction.from];
  const assetSent = assetTransfer?.sent ?? [];
  if (assetSent.length > 0 && assetSent[0].type !== 'eth') {
    return false;
  }
  // check if other transaction parties received ether
  const transactionParties: string[] = Object.keys(
    transaction.netAssetTransfers,
  )
    .reduce((parties, address) => {
      parties = [...new Set([...parties, address])];
      return parties;
    }, [])
    .filter(
      (address) =>
        address !== KNOWN_ADDRESSES.NULL && address !== transaction.from,
    );

  for (const address of transactionParties) {
    const assetReceived = transaction.netAssetTransfers[address]?.received;
    if (assetReceived.length === 0 || assetReceived[0].type !== 'eth') {
      return false;
    }
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter((transfer) => {
    return transfer.from === KNOWN_ADDRESSES.NULL;
  });

  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = {
    ...mints[0],
    token: mints[0].asset,
  };
  delete assetTransfer.asset;
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const assetSent = transaction.netAssetTransfers[transaction.from]?.sent;
  const price = assetSent[0]?.value ?? '0';

  transaction.context = {
    variables: {
      token: {
        type: 'erc1155',
        token: assetTransfer.token,
        tokenId: assetTransfer.tokenId,
        value: assetTransfer.value,
      },
      recipient: {
        type: 'address',
        value: recipient,
      },
      minted: { type: 'contextAction', value: 'MINTED' },
      price: {
        type: 'eth',
        value: price,
        unit: 'wei',
      },
    },
    summaries: {
      category: 'NFT',
      en: {
        title: 'NFT Mint',
        default: '[[recipient]] [[minted]] [[token]] for [[price]]',
      },
    },
  };

  if (amount > 1) {
    transaction.context.variables['amount'] = {
      type: 'number',
      value: amount,
      unit: 'x',
    };
    transaction.context.summaries.en.default =
      '[[recipient]] [[minted]] [[amount]] [[token]] for [[price]]';
  }

  return transaction;
}

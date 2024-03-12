import { Hex } from 'viem';
import { AssetType, ETHAssetTransfer, Transaction } from '../../types';
import {
  ZORA_CREATOR_ABI,
  ZORA_CREATOR_CONTRACTS,
  PROTOCOL_REWARDS_CONTRACT,
} from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== ZORA_CREATOR_CONTRACTS[transaction.chainId]) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ZORA_CREATOR_ABI,
  );

  if (!decoded) return false;

  // should call "mintWithRewards" in ZoraCreator
  if (decoded.functionName !== 'mintWithRewards') {
    return false;
  }
  // check if eth is paid to protocol rewards contract
  const assetTransfers = transaction.assetTransfers;
  if (!assetTransfers) return false;
  const rewardsTransfer = assetTransfers.find(
    (transfer) =>
      transfer.to === PROTOCOL_REWARDS_CONTRACT &&
      transfer.type === AssetType.ETH,
  );
  if (!rewardsTransfer) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ZORA_CREATOR_ABI,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'mintWithRewards': {
      const assetTransfers = transaction.assetTransfers;
      if (!assetTransfers) return transaction;
      const tipTransfer = assetTransfers.find(
        (transfer) =>
          transfer.to === PROTOCOL_REWARDS_CONTRACT &&
          transfer.type === AssetType.ETH,
      ) as ETHAssetTransfer;
      if (!tipTransfer) return transaction;

      transaction.context = {
        variables: {
          subject: {
            type: 'address',
            value: transaction.from,
          },
          contextAction: {
            type: 'contextAction',
            value: 'TIPPED',
          },
          receiver: {
            type: 'address',
            value: tipTransfer.to,
          },
          numOfEth: {
            type: AssetType.ETH,
            value: tipTransfer.value,
            unit: 'wei',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Disperse',
            default: '[[subject]][[contextAction]][[receiver]][[numOfEth]]',
          },
        },
      };
      return transaction;
    }
  }

  return transaction;
};

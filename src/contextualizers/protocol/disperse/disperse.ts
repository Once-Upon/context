import { Hex } from 'viem';
import { AssetType, ETHAssetTransfer, Transaction } from '../../../types';
import {
  DISPERSE_ABI,
  DISPERSE_CONTRACTS,
  TIP_FEE_RECEIVER,
} from './constants';
import {
  decodeTransactionInput,
  formatNativeToken,
} from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.chainId) return false;
  if (transaction.to !== DISPERSE_CONTRACTS[transaction.chainId]) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    DISPERSE_ABI,
  );

  if (!decoded) return false;

  // should call "disperseEther" in Disperse
  if (decoded.functionName !== 'disperseEther') {
    return false;
  }
  // check if tip fee is paid
  const assetTransfers = transaction.assetTransfers;
  if (!assetTransfers) return false;
  const tipFeeTransfer = assetTransfers.find(
    (transfer) =>
      transfer.to === TIP_FEE_RECEIVER &&
      transaction.chainId &&
      transfer.to !== DISPERSE_CONTRACTS[transaction.chainId],
  );
  if (!tipFeeTransfer) {
    return false;
  }
  // check if tipFee transfer is eth transfer
  if (tipFeeTransfer.type !== AssetType.ETH) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    DISPERSE_ABI,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'disperseEther': {
      const assetTransfers = transaction.assetTransfers;
      if (!assetTransfers) return transaction;
      const tipTransfer = assetTransfers.find(
        (transfer) =>
          transfer.to !== TIP_FEE_RECEIVER &&
          transaction.chainId &&
          transfer.to !== DISPERSE_CONTRACTS[transaction.chainId],
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
            type: formatNativeToken(transaction.chainId),
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

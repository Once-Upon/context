import { Abi, Hex } from 'viem';
import {
  AssetType,
  ERC20Asset,
  EventLogTopics,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';
import { UNISWAP_V3_PAIR_ABI } from './constants';
import { decodeLog } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isSwap = detect(transaction);
  if (!isSwap) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check logs
  const logs = transaction.logs;
  if (!logs) return false;

  for (const log of logs) {
    const decoded = decodeLog(
      UNISWAP_V3_PAIR_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (decoded && decoded.eventName === 'Swap') return true;
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (!transaction.netAssetTransfers || !transaction.logs) return transaction;
  let decoded;
  for (const log of transaction.logs) {
    decoded = decodeLog(
      UNISWAP_V3_PAIR_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (decoded && decoded.eventName === 'Swap') {
      break;
    }
  }
  if (!decoded) return transaction;

  const sender: string = decoded.args['sender'].toLowerCase();
  const recipient: string = decoded.args['recipient'].toLowerCase();
  if (
    !transaction.netAssetTransfers[sender] ||
    !transaction.netAssetTransfers[sender].sent?.length ||
    !transaction.netAssetTransfers[recipient] ||
    !transaction.netAssetTransfers[recipient].received?.length
  ) {
    return transaction;
  }

  const sentAssetTransfer = transaction.netAssetTransfers[sender]
    .sent[0] as ERC20Asset;
  const receivedAssetTransfer = transaction.netAssetTransfers[recipient]
    .received[0] as ERC20Asset;

  transaction.context = {
    variables: {
      sender: {
        type: 'address',
        value: sender,
      },
      recipient: {
        type: 'address',
        value: recipient,
      },
      tokenIn: {
        type: AssetType.ERC20,
        value: sentAssetTransfer.value,
        token: sentAssetTransfer.contract,
      },
      tokenOut: {
        type: AssetType.ERC20,
        value: receivedAssetTransfer.value,
        token: receivedAssetTransfer.contract,
      },
      contextAction: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.SWAPPED, // TODO: Make a Uniswap version of this
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Uniswap',
        default: '[[sender]]swapped[[tokenIn]]for[[tokenOut]]',
      },
    },
  };

  return transaction;
};

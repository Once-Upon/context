import { Abi, Hex } from 'viem';
import {
  AssetType,
  ERC20Asset,
  EventLogTopics,
  Transaction,
} from '../../../types';
import { UNISWAP_V3_SWAP_EVENT_HASH, UNISWAP_V3_PAIR_ABI } from './constants';
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

  const swapLog = logs.find((log) => log.topic0 === UNISWAP_V3_SWAP_EVENT_HASH);
  if (!swapLog) return false;

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (!transaction.netAssetTransfers) return transaction;
  const swapLog = transaction.logs
    ? transaction.logs.find((log) => log.topic0 === UNISWAP_V3_SWAP_EVENT_HASH)
    : null;
  if (!swapLog) return transaction;
  // decode swap event
  const decoded = decodeLog(
    UNISWAP_V3_PAIR_ABI as Abi,
    swapLog.data as Hex,
    [
      swapLog.topic0,
      swapLog.topic1,
      swapLog.topic2,
      swapLog.topic3,
    ] as EventLogTopics,
  );
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
        value: 'SWAP',
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

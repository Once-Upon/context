import { Abi, Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../../types';
import {
  ENJOY_CONTRACT_ADDRESS,
  UNISWAP_V3_SWAP_EVENT_HASH,
  UNISWAP_V3_PAIR_ABI,
} from './constants';
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

  transaction.context = {
    variables: {
      sender: {
        type: 'address',
        value: decoded.args['sender'],
      },
      contextAction: {
        type: 'contextAction',
        value: 'SWAP',
      },
      numETH: {
        type: AssetType.ETH,
        value: transaction.value.toString(),
        unit: 'wei',
      },
      numENJOY: {
        type: AssetType.ERC20,
        value: decoded.args[2].toString(),
        token: ENJOY_CONTRACT_ADDRESS,
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Uniswap',
        default: '[[lp]][[contextAction]]with[[numETH]]and[[numENJOY]]',
      },
    },
  };

  return transaction;
};

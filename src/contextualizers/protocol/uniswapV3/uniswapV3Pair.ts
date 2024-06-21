import { Abi, Hex } from 'viem';
import {
  AssetType,
  ERC20Asset,
  EventLogTopics,
  HeuristicContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
  UniswapV3PairActionEnum,
} from '../../../types';
import { UNISWAP_V3_PAIR_ABI, UNIVERSAL_ROUTERS } from './constants';
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
  if (
    !transaction.netAssetTransfers ||
    !transaction.logs ||
    !transaction.chainId
  )
    return transaction;
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
  const isUniversalRouter =
    UNIVERSAL_ROUTERS[transaction.chainId] &&
    UNIVERSAL_ROUTERS[transaction.chainId].includes(sender);
  if (
    !transaction.netAssetTransfers[sender] ||
    !transaction.netAssetTransfers[sender].sent?.length ||
    !transaction.netAssetTransfers[recipient] ||
    !transaction.netAssetTransfers[recipient].received?.length
  ) {
    return transaction;
  }

  const sentAssetTransfer = transaction.netAssetTransfers[sender].sent.find(
    (assetTransfer) => assetTransfer.type === AssetType.ERC20,
  ) as ERC20Asset;
  const receivedAssetTransfer = transaction.netAssetTransfers[
    recipient
  ].received.find(
    (assetTransfer) => assetTransfer.type === AssetType.ERC20,
  ) as ERC20Asset;

  transaction.context = {
    actions: [
      HeuristicContextActionEnum.SWAPPED,
      `${Protocols.UNISWAP_V3_PAIR}.${UniswapV3PairActionEnum.SWAPPED}`,
    ],

    variables: {
      sender: {
        type: 'address',
        value: isUniversalRouter ? transaction.from : sender,
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
        id: `${Protocols.UNISWAP_V3_PAIR}.${UniswapV3PairActionEnum.SWAPPED}`,
        value: UniswapV3PairActionEnum.SWAPPED,
      },
    },

    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: ProtocolMap[Protocols.UNISWAP_V3_PAIR],
        default: '[[sender]]swapped[[tokenIn]]for[[tokenOut]]',
      },
    },
  };

  return transaction;
};

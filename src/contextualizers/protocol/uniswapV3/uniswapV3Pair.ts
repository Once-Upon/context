import { Abi, Hex } from 'viem';
import {
  AssetType,
  ERC20Asset,
  ETHAsset,
  EventLogTopics,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';
import { generate as Erc20SwapGenerator } from '../../heuristics/erc20Swap/erc20Swap';
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

  const recipient: string = decoded.args['recipient'].toLowerCase();
  // check if recipient is the swapper
  if (recipient === transaction.from.toLowerCase()) {
    // go with heuristic erc20Swap contextualizer
    // Generate context using heuristic ERC20Swap Contextualizer
    transaction = Erc20SwapGenerator(transaction);
    // If the ERC20Swap Contextualizer did not generate context, return the transaction
    if (transaction.context?.summaries?.en.title !== 'ERC20 Swap')
      return transaction;

    // Update the context to be specific to Uniswap V3
    transaction.context.summaries.category = 'PROTOCOL_1';
    transaction.context.summaries.en.title = 'Uniswap';
  } else {
    const sender = transaction.from.toLowerCase();

    const sentAssetTransfer = transaction.netAssetTransfers[sender].sent.find(
      (assetTransfer) =>
        assetTransfer.type === AssetType.ERC20 || AssetType.ETH,
    ) as ERC20Asset | ETHAsset;
    const receivedAssetTransfer = transaction.netAssetTransfers[
      recipient
    ].received.find(
      (assetTransfer) => assetTransfer.type === AssetType.ERC20,
    ) as ERC20Asset;

    let tokenIn;
    switch (sentAssetTransfer.type) {
      case AssetType.ERC20:
        tokenIn = {
          type: AssetType.ERC20,
          value: sentAssetTransfer.value,
          token: sentAssetTransfer.contract,
        };
        break;
      case AssetType.ETH:
        tokenIn = {
          type: AssetType.ETH,
          value: sentAssetTransfer.value,
          unit: 'wei',
        };
        break;
    }
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
        tokenIn,
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
  }

  return transaction;
};

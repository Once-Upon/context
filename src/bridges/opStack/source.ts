import { Hex } from 'viem';
import { getL2HashFromL1DepositInfo } from 'op-viem';
import type { TransactionDepositedEvent } from 'op-viem';
import {
  Transaction,
  Asset,
  AssetType,
  ContextSummaryVariableType,
  ContextETHType,
  ContextERC20Type,
  ContextERC721Type,
  ContextERC1155Type,
  EventLogTopics,
} from '../../types';
import {
  TRANSACTION_DEPOSITED_EVENT_ABI,
  TRANSACTION_DEPOSITED_EVENT_HASH,
} from './constants';
import { decodeLog } from '../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isOpStack = detect(transaction);
  if (!isOpStack) return transaction;

  const result = generate(transaction);
  return result;
}

export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (transaction.chainId === 1) {
    const logs = transaction.logs ?? [];
    const transactionDepositedLog = logs.find((log: any) => {
      return (
        log.topics?.length > 0 &&
        log.topics[0] === TRANSACTION_DEPOSITED_EVENT_HASH
      );
    });

    if (transactionDepositedLog) {
      return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const assetSent = transaction.netAssetTransfers
    ? transaction.netAssetTransfers[transaction.from]?.sent
    : [];
  if (!assetSent?.length) {
    return transaction;
  }
  const assetTransfer: Asset = assetSent[0];
  // Note: Other contextualizers fetch this id dynamically
  const destinationChainId = 10;

  let asset: ContextSummaryVariableType;
  switch (assetTransfer.type) {
    case AssetType.ETH:
      asset = {
        type: AssetType.ETH,
        value: assetTransfer.value,
        unit: 'wei',
      } as ContextETHType;
      break;
    case AssetType.ERC20:
      asset = {
        type: AssetType.ERC20,
        token: assetTransfer.asset,
        value: assetTransfer.value,
      } as ContextERC20Type;
      break;
    case AssetType.ERC721:
      asset = {
        type: AssetType.ERC721,
        token: assetTransfer.asset,
        tokenId: assetTransfer.tokenId,
      } as ContextERC721Type;
      break;
    case AssetType.ERC1155:
      asset = {
        type: AssetType.ERC1155,
        token: assetTransfer.asset,
        tokenId: assetTransfer.tokenId,
        value: assetTransfer.value,
      } as ContextERC1155Type;
      break;
  }

  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[sender]] [[bridged]] [[asset]] to [[chainID]]',
      },
    },
    variables: {
      sender: {
        type: 'address',
        value: transaction.from,
      },
      chainID: {
        type: 'chainID',
        value: destinationChainId,
      },
      bridged: {
        type: 'contextAction',
        value: 'BRIDGED',
      },
      asset,
    },
  };

  const logs = transaction.logs ?? [];
  const transactionDepositedLog = logs.find((log: any) => {
    return (
      log.topics?.length > 0 &&
      log.topics[0] === TRANSACTION_DEPOSITED_EVENT_HASH
    );
  });

  if (transactionDepositedLog) {
    // Now parse the data to pull out the nonce for this message
    const transactionDepositedEvent = decodeLog(
      TRANSACTION_DEPOSITED_EVENT_ABI,
      transactionDepositedLog.data as Hex,
      transactionDepositedLog.topics as EventLogTopics,
    );
    if (!transactionDepositedEvent) return transaction;

    const event: TransactionDepositedEvent = {
      eventName: 'TransactionDeposited',
      args: {
        from: transactionDepositedEvent.args['from'] as Hex,
        to: transactionDepositedEvent.args['to'] as Hex,
        version: transactionDepositedEvent.args['version'] as bigint,
        opaqueData: transactionDepositedEvent.args['opaqueData'] as Hex,
      },
    };
    const optimismTxHash = getL2HashFromL1DepositInfo({
      event,
      logIndex: transactionDepositedLog.logIndex,
      blockHash: transaction.blockHash as `0x${string}`,
    });

    if (transaction.context.summaries && transaction.context.variables) {
      // add resulting in
      transaction.context.summaries.en.default +=
        ' resulting in [[transaction]]';
      // add transaction in variables
      transaction.context.variables['transaction'] = {
        type: 'transaction',
        value: optimismTxHash,
      };
    }
  }

  return transaction;
}

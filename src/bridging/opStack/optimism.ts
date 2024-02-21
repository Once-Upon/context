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
import { DatabaseService } from '../../../database/database.service';
import {
  OPTIMISM_BRIDGE_PROXY,
  TRANSACTION_DEPOSITED_EVENT_SIG,
  TRANSACTION_DEPOSITED_EVENT_HASH,
  OPTIMISM_ETHEREUM_GATEWAY,
} from './constants';
import { CHAINS } from '../constants';
import { decodeLog } from '../../helpers/utils';

export async function OpStackContextualizer(
  transaction: Transaction,
  databaseService: DatabaseService,
  contextualize: (transaction: Transaction) => Promise<Transaction>,
): Promise<Transaction> {
  const isOpStack = await detectOpStack(transaction, databaseService);
  if (!isOpStack) return transaction;

  const result = await generateOpStackContext(
    transaction,
    databaseService,
    contextualize,
  );
  return result;
}

export async function detectOpStack(
  transaction: Transaction,
  databaseService: DatabaseService,
): Promise<boolean> {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (
    transaction.chainId === 1 &&
    transaction.to === OPTIMISM_ETHEREUM_GATEWAY
  ) {
    const logs = transaction.logs ?? [];
    const transactionDepositedLog = logs.find((log: any) => {
      return (
        log.address === OPTIMISM_BRIDGE_PROXY &&
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

export async function generateOpStackContext(
  transaction: Transaction,
  databaseService: DatabaseService,
  contextualize: (transaction: Transaction) => Promise<Transaction>,
): Promise<Transaction> {
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

  // TODO; not sure why we didn't set context here for optimism
  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge to ${CHAINS[destinationChainId]?.name}`,
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
      log.address === OPTIMISM_BRIDGE_PROXY &&
      log.topics?.length > 0 &&
      log.topics[0] === TRANSACTION_DEPOSITED_EVENT_HASH
    );
  });

  if (transactionDepositedLog) {
    // Now parse the data to pull out the nonce for this message
    const transactionDepositedEvent = decodeLog(
      TRANSACTION_DEPOSITED_EVENT_SIG,
      transactionDepositedLog.data as Hex,
      transactionDepositedLog.topics as EventLogTopics,
    );
    if (!transactionDepositedEvent) return transaction;

    const event: TransactionDepositedEvent = {
      eventName: 'TransactionDeposited',
      args: {
        from: transactionDepositedEvent.args[0] as Hex,
        to: transactionDepositedEvent.args[1] as Hex,
        version: transactionDepositedEvent.args[2] as bigint,
        opaqueData: transactionDepositedEvent.args[3] as Hex,
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

    const optimismTx = await databaseService.transactionCollection.findOne({
      hash: optimismTxHash,
    });
    if (optimismTx) {
      const crossChainTx = await contextualize(optimismTx);
      transaction.context.crossChainTx = [crossChainTx];
    }
  }

  return transaction;
}

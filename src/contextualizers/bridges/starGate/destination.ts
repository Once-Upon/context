import { Hex, Abi } from 'viem';
import {
  AssetType,
  ContextERC1155Type,
  ContextERC20Type,
  ContextERC721Type,
  ContextETHType,
  ContextSummaryVariableType,
  EventLogTopics,
  HeuristicContextActionEnum,
  Log,
  Transaction,
} from '../../../types';
import {
  STAR_GATE_RELAYERS,
  STAR_GATE_PACKET_RECEIVED_EVENT_ABI,
  STAR_GATE_CHAIN_IDS,
} from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isStarGate = detect(transaction);
  if (!isStarGate) return transaction;

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
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];

  const packetReceivedLog = logs.find((log: Log) => {
    if (log.address !== STAR_GATE_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      STAR_GATE_PACKET_RECEIVED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'PacketReceived') return true;
  });

  if (packetReceivedLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  let decodedPacketReceivedLog;

  for (const log of logs) {
    if (log.address !== STAR_GATE_RELAYERS[originChainId]) continue;

    const decoded = decodeLog(
      STAR_GATE_PACKET_RECEIVED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) continue;

    if (decoded.eventName === 'PacketReceived') {
      decodedPacketReceivedLog = decoded;
      break;
    }
  }

  if (!decodedPacketReceivedLog) return transaction;

  const sourceChainId = Number(
    decodedPacketReceivedLog.args['srcChainId'] as bigint,
  );
  if (!STAR_GATE_CHAIN_IDS[sourceChainId]) return transaction;

  let assetTransfer;
  for (const address in transaction.netAssetTransfers) {
    const assetTransferred = transaction.netAssetTransfers[address];
    if (assetTransferred.received.length > 0) {
      assetTransfer = assetTransferred.received[0];
      break;
    }
    if (assetTransferred.sent.length > 0) {
      assetTransfer = assetTransferred.sent[0];
      break;
    }
  }

  let asset: ContextSummaryVariableType = {
    type: AssetType.ETH,
    value: '0',
    unit: 'wei',
  };
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
        token: assetTransfer.contract,
        value: assetTransfer.value,
      } as ContextERC20Type;
      break;
    case AssetType.ERC721:
      asset = {
        type: AssetType.ERC721,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
      } as ContextERC721Type;
      break;
    case AssetType.ERC1155:
      asset = {
        type: AssetType.ERC1155,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
        value: assetTransfer.value,
      } as ContextERC1155Type;
      break;
  }

  transaction.context = {
    actions: [HeuristicContextActionEnum.BRIDGED],

    variables: {
      subject: {
        type: 'address',
        value: transaction.from,
      },
      asset,
      chainID: {
        type: 'chainID',
        value: STAR_GATE_CHAIN_IDS[sourceChainId],
      },
      bridged: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BRIDGED,
        value: HeuristicContextActionEnum.BRIDGED,
      },
    },

    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[subject]][[bridged]][[asset]]from[[chainID]]',
      },
    },
  };

  return transaction;
}

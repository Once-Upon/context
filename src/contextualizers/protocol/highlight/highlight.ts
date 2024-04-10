import { Abi, Hex } from 'viem';
import {
  AssetType,
  ERC1155AssetTransfer,
  ERC721AssetTransfer,
  EventLogTopics,
  Transaction,
  HeuristicContextActionEnum,
} from '../../../types';
import { MINT_MANAGER_ABI } from './constants';
import { decodeLog } from '../../../helpers/utils';
import { KNOWN_ADDRESSES } from '../../../helpers/constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isHighlight = detect(transaction);
  if (!isHighlight) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check logs
  const logs = transaction.logs;
  if (!logs) return false;

  for (const log of logs) {
    const decoded = decodeLog(
      MINT_MANAGER_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (decoded && decoded.eventName === 'CreatorRewardPayout') return true;
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (
    !transaction.assetTransfers ||
    !transaction.netAssetTransfers ||
    !transaction.logs
  ) {
    return transaction;
  }

  let decodedLog;
  for (const log of transaction.logs) {
    decodedLog = decodeLog(
      MINT_MANAGER_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (decodedLog && decodedLog.eventName === 'CreatorRewardPayout') break;
  }

  if (!decodedLog) return transaction;
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      (transfer.type === AssetType.ERC1155 ||
        transfer.type === AssetType.ERC721),
  ) as (ERC1155AssetTransfer | ERC721AssetTransfer)[];

  const assetTransfer = mints[0];
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const mintPrice = transaction.value ? transaction.value.toString() : '0';
  const mintReferralAmount = decodedLog.args['amount'].toString();
  const sender = transaction.from;

  transaction.context = {
    variables: {
      recipient: {
        type: 'address',
        value: recipient,
      },
      sender: {
        type: 'address',
        value: sender,
      },
      mintReferralAmount: {
        type: AssetType.ETH,
        value: mintReferralAmount,
        unit: 'wei',
      },
      mintPrice: {
        type: AssetType.ETH,
        value: mintPrice,
        unit: 'wei',
      },
      minted: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.MINTED,
      },
      mintReferral: {
        type: 'address',
        value: decodedLog.args['rewardRecipient'].toLowerCase(),
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Highlight',
        default: '',
      },
    },
  };

  switch (assetTransfer.type) {
    case AssetType.ERC1155:
      transaction.context.variables = {
        ...transaction.context.variables,
        token: {
          type: AssetType.ERC1155,
          token: assetTransfer.contract,
          value: assetTransfer.value,
          tokenId: assetTransfer.tokenId,
        },
      };
      break;
    case AssetType.ERC721:
      transaction.context.variables = {
        ...transaction.context.variables,
        token: {
          type: AssetType.ERC721,
          token: assetTransfer.contract,
          tokenId: assetTransfer.tokenId,
        },
      };
      break;
  }

  if (amount > 1) {
    transaction.context.variables = {
      ...transaction.context.variables,
      amount: {
        type: 'number',
        value: amount,
        unit: 'x',
      },
    };

    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'Highlight',
        default:
          sender === recipient
            ? '[[recipient]][[minted]][[amount]][[token]]'
            : '[[sender]][[minted]][[amount]][[token]]to[[recipient]]',
      },
    };
    if (BigInt(mintPrice) > BigInt(0)) {
      transaction.context.summaries['en'].default += 'for[[mintPrice]]';
    }
  } else {
    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'Highlight',
        default:
          sender === recipient
            ? '[[recipient]][[minted]][[token]]'
            : '[[sender]][[minted]][[token]]to[[recipient]]',
      },
    };
    if (BigInt(mintPrice) > BigInt(0)) {
      transaction.context.summaries['en'].default += 'for[[mintPrice]]';
    }
  }

  transaction.context.summaries['en'].default +=
    'with[[mintReferralAmount]]for[[mintReferral]]';

  return transaction;
};

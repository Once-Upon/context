import { Hex } from 'viem';
import {
  AssetType,
  ERC1155AssetTransfer,
  ERC721AssetTransfer,
  ETHAsset,
  EventLogTopics,
  Transaction,
} from '../../types';
import {
  PROTOCOL_REWARDS_ABI,
  PROTOCOL_REWARDS_CONTRACT,
  REWARDS_DEPOSIT_TOPIC,
} from './constants';
import { decodeLog } from '../../helpers/utils';
import { KNOWN_ADDRESSES } from '../../helpers/constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check if there is 'RewardsDeposit' log emitted
  const logs =
    transaction.logs && transaction.logs.length > 0 ? transaction.logs : [];
  const rewardsDepositLog = logs.find(
    (log) =>
      log.topics[0] === REWARDS_DEPOSIT_TOPIC &&
      log.address === PROTOCOL_REWARDS_CONTRACT,
  );
  if (!rewardsDepositLog) return false;

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (!transaction.assetTransfers || !transaction.netAssetTransfers) {
    return transaction;
  }

  const logs =
    transaction.logs && transaction.logs.length > 0 ? transaction.logs : [];
  const rewardsDepositLog = logs.find(
    (log) => log.topics[0] === REWARDS_DEPOSIT_TOPIC,
  );
  if (!rewardsDepositLog) return transaction;
  const decodedLog = decodeLog(
    PROTOCOL_REWARDS_ABI,
    rewardsDepositLog.data as Hex,
    rewardsDepositLog.topics as EventLogTopics,
  );
  if (
    !decodedLog ||
    !decodedLog.args['mintReferralReward'] ||
    !decodedLog.args['mintReferral']
  )
    return transaction;
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      (transfer.type === AssetType.ERC1155 ||
        transfer.type === AssetType.ERC721),
  ) as (ERC1155AssetTransfer | ERC721AssetTransfer)[];

  if (
    transaction.hash ===
    '0x6ccb91df096cdeedd6865a5a90f3c285c5b885ce76872e9a327d6c41ae6d3140'
  ) {
    console.log('mints', mints);
  }

  const assetTransfer = mints[0];
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const assetSent = transaction.netAssetTransfers[transaction.from]
    ?.sent as ETHAsset[];
  const price =
    assetSent && assetSent.length > 0 && assetSent[0]?.value
      ? assetSent[0].value
      : '0';

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
      price: {
        type: AssetType.ETH,
        value: price,
        unit: 'wei',
      },
      minted: { type: 'contextAction', value: 'MINTED' },
      numOfEth: {
        type: AssetType.ETH,
        value: decodedLog.args['mintReferralReward'].toString(),
        unit: 'wei',
      },
      mintReferral: {
        type: 'address',
        value: decodedLog.args['mintReferral'].toLowerCase(),
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Zora',
        default: '', // filled in below
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
        title: 'Zora',
        default:
          sender === recipient
            ? '[[recipient]][[minted]][[amount]][[token]]'
            : '[[sender]][[minted]][[amount]][[token]]to[[recipient]]',
      },
    };
    if (BigInt(price) > BigInt(0)) {
      transaction.context.summaries['en'].default += 'for[[price]]';
    }
  } else {
    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'Zora',
        default:
          sender === recipient
            ? '[[recipient]][[minted]][[token]]'
            : '[[sender]][[minted]][[token]]to[[recipient]]',
      },
    };
    if (BigInt(price) > BigInt(0)) {
      transaction.context.summaries['en'].default += 'for[[price]]';
    }
  }

  transaction.context.summaries['en'].default +=
    'with[[numOfEth]]in rewards for[[mintReferral]]';

  return transaction;
};

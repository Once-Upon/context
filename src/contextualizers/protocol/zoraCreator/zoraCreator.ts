import { Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../../types';
import {
  PROTOCOL_REWARDS_ABI,
  PROTOCOL_REWARDS_CONTRACT,
  REWARDS_DEPOSIT_TOPIC,
} from './constants';
import { decodeLog, processNFTTransaction } from '../../../helpers/utils';

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
      log.topic0 === REWARDS_DEPOSIT_TOPIC &&
      log.address === PROTOCOL_REWARDS_CONTRACT,
  );
  if (!rewardsDepositLog) return false;

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  // detect as heuristic erc721 or erc1155 mint
  transaction = processNFTTransaction(transaction);
  if (!transaction.context?.summaries?.category) {
    return transaction;
  }
  // update category and title
  transaction.context.summaries.category = 'PROTOCOL_1';
  transaction.context.summaries.en.title = 'Zora';

  const logs =
    transaction.logs && transaction.logs.length > 0 ? transaction.logs : [];
  const rewardsDepositLog = logs.find(
    (log) => log.topic0 === REWARDS_DEPOSIT_TOPIC,
  );
  if (!rewardsDepositLog) return transaction;
  const decodedLog = decodeLog(
    PROTOCOL_REWARDS_ABI,
    rewardsDepositLog.data as Hex,
    [
      rewardsDepositLog.topic0,
      rewardsDepositLog.topic1,
      rewardsDepositLog.topic2,
      rewardsDepositLog.topic3,
    ] as EventLogTopics,
  );
  if (
    !decodedLog ||
    !decodedLog.args['mintReferralReward'] ||
    !decodedLog.args['mintReferral']
  )
    return transaction;

  transaction.context.variables = {
    ...transaction.context.variables,
    numOfEth: {
      type: AssetType.ETH,
      value: decodedLog.args['mintReferralReward'].toString(),
      unit: 'wei',
    },
    mintReferral: {
      type: 'address',
      value: decodedLog.args['mintReferral'].toLowerCase(),
    },
  };

  transaction.context.summaries['en'].default +=
    'with[[numOfEth]]in rewards for[[mintReferral]]';

  return transaction;
};

import { Hex } from 'viem';
import {
  AssetType,
  ERC1155AssetTransfer,
  ETHAsset,
  EventLogTopics,
  Transaction,
} from '../../types';
import {
  ZORA_CREATOR_ABI,
  PROTOCOL_REWARDS_ABI,
  PROTOCOL_REWARDS_CONTRACT,
  REWARDS_DEPOSIT_TOPIC,
} from './constants';
import { decodeTransactionInput, decodeLog } from '../../helpers/utils';
import { KNOWN_ADDRESSES } from '../../helpers/constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ZORA_CREATOR_ABI,
  );

  if (!decoded) return false;

  // should call "mintWithRewards" in ZoraCreator
  if (decoded.functionName !== 'mintWithRewards') {
    return false;
  }

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

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ZORA_CREATOR_ABI,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'mintWithRewards': {
      // decode RewardsDeposit log
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
          transfer.type === AssetType.ERC1155,
      ) as ERC1155AssetTransfer[];

      const assetTransfer = mints[0];
      const assetSent = transaction.netAssetTransfers[transaction.from]
        ?.sent as ETHAsset[];
      const price =
        assetSent && assetSent.length > 0 && assetSent[0]?.value
          ? assetSent[0].value
          : '0';

      transaction.context = {
        variables: {
          recipient: {
            type: 'address',
            value: transaction.from,
          },
          contextAction: { type: 'contextAction', value: 'MINTED' },
          token: {
            type: AssetType.ERC1155,
            token: assetTransfer.asset,
            tokenId: assetTransfer.tokenId,
            value: assetTransfer.value,
          },
          price: {
            type: AssetType.ETH,
            value: price,
            unit: 'wei',
          },
          numOfEth: {
            type: AssetType.ETH,
            value: decodedLog.args['mintReferralReward'].toString(),
            unit: 'wei',
          },
          mintReferral: {
            type: 'address',
            value: decodedLog.args['mintReferral'],
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'ZoraCreator',
            default:
              '[[recipient]][[contextAction]][[token]]for[[price]]with[[numOfEth]]in rewards for[[mintReferral]]',
          },
        },
      };
      return transaction;
    }
  }

  return transaction;
};

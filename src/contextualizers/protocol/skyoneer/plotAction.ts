import {
  Transaction,
  EventLogTopics,
  CropXyzContextActionEnum,
  AssetType,
} from '../../../types';
import { PLOT_ACTION_CONTRACT_ADDRESS, PLOT_ACTION_ABI } from './constants';
import { decodeLog, processAssetTransfers } from '../../../helpers/utils';
import { CHAIN_IDS } from '../../../helpers/constants';

export function contextualize(transaction: Transaction): Transaction {
  const isPackActivationSource = detect(transaction);
  if (!isPackActivationSource) return transaction;

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
  // check logs
  if (!transaction.logs) return false;

  for (const log of transaction.logs) {
    if (log.address !== PLOT_ACTION_CONTRACT_ADDRESS) continue;

    const decoded = decodeLog(PLOT_ACTION_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (
      decoded &&
      (decoded.eventName === 'HarvestedPlot' ||
        decoded.eventName === 'ClearedDiedHarvest' ||
        decoded.eventName === 'ClearedHarvest' ||
        decoded.eventName === 'StakedCrop')
    ) {
      return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (
    !transaction.logs ||
    transaction.chainId !== CHAIN_IDS.gold ||
    !transaction.assetTransfers ||
    !transaction.netAssetTransfers
  )
    return transaction;

  const { erc20Payments } = processAssetTransfers(
    transaction.netAssetTransfers,
    transaction.assetTransfers,
  );

  let decoded;
  for (const log of transaction.logs) {
    if (log.address !== PLOT_ACTION_CONTRACT_ADDRESS) continue;

    decoded = decodeLog(PLOT_ACTION_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (!decoded) continue;

    let player = '';
    switch (decoded.eventName) {
      case 'HarvestedPlot':
        player = decoded.args['player'].toLowerCase();
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: `CropXYZ`,
              default: '[[player]][[harvested]][[crop]]',
            },
          },
          variables: {
            player: {
              type: 'address',
              value: player,
            },
            crop: {
              type: AssetType.ERC20,
              token: erc20Payments[0].contract,
              value: erc20Payments[0].value,
            },
            harvested: {
              type: 'contextAction',
              value: CropXyzContextActionEnum.HARVESTED_PLOT,
            },
          },
        };
        return transaction;
      case 'ClearedDiedHarvest':
        player = decoded.args['player'].toLowerCase();
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: `CropXYZ`,
              default: '[[player]][[clearedHarvest]]',
            },
          },
          variables: {
            player: {
              type: 'address',
              value: player,
            },
            clearedHarvest: {
              type: 'contextAction',
              value: CropXyzContextActionEnum.CLEARED_HARVEST,
            },
          },
        };
        return transaction;
      case 'ClearedHarvest':
        player = decoded.args['player'].toLowerCase();
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: `CropXYZ`,
              default: '[[player]][[clearedHarvest]]',
            },
          },
          variables: {
            player: {
              type: 'address',
              value: player,
            },
            clearedHarvest: {
              type: 'contextAction',
              value: CropXyzContextActionEnum.CLEARED_HARVEST,
            },
          },
        };
        return transaction;
      case 'StakedCrop':
        player = decoded.args['player'].toLowerCase();
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: `CropXYZ`,
              default: '[[player]][[planted]][[crop]]',
            },
          },
          variables: {
            player: {
              type: 'address',
              value: player,
            },
            crop: {
              type: AssetType.ERC20,
              token: erc20Payments[0].contract,
              value: erc20Payments[0].value,
            },
            planted: {
              type: 'contextAction',
              value: CropXyzContextActionEnum.PLANTED,
            },
          },
        };
        return transaction;
      default:
        break;
    }
  }

  return transaction;
}

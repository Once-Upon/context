import {
  Transaction,
  EventLogTopics,
  CropXyzContextActionEnum,
} from '../../../types';
import { PLOT_ACTION_CONTRACT_ADDRESS, PLOT_ACTION_ABI } from './constants';
import { decodeLog } from '../../../helpers/utils';

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
  if (!transaction.logs || !transaction.chainId) return transaction;

  // decode ActivatedStarterPackOnSource event
  let decoded;
  for (const log of transaction.logs) {
    if (log.address !== PLOT_ACTION_CONTRACT_ADDRESS) continue;

    decoded = decodeLog(PLOT_ACTION_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'HarvestedPlot') {
      const player = decoded.args['player'];
      const plotId = decoded.args['plotId'];
      transaction.context = {
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: `Gold`,
            default: '[[player]][[harvested]]plots[[plotId]]',
          },
        },
        variables: {
          player: {
            type: 'address',
            value: player,
          },
          plotId: {
            type: 'number',
            value: plotId,
          },
          harvested: {
            type: 'contextAction',
            value: CropXyzContextActionEnum.HARVESTED_PLOT,
          },
        },
      };
      return transaction;
    }

    if (decoded && decoded.eventName === 'ClearedHarvest') {
      const player = decoded.args['player'];
      const plotId = decoded.args['plotId'];
      transaction.context = {
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: `Gold`,
            default: '[[player]][[clearedHarvest]]plots[[plotId]]',
          },
        },
        variables: {
          player: {
            type: 'address',
            value: player,
          },
          plotId: {
            type: 'number',
            value: plotId,
          },
          clearedHarvest: {
            type: 'contextAction',
            value: CropXyzContextActionEnum.CLEARED_HARVEST,
          },
        },
      };
      return transaction;
    }

    if (decoded && decoded.eventName === 'StakedCrop') {
      const player = decoded.args['player'];
      const plotId = decoded.args['plotId'];
      transaction.context = {
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: `CropXYZ`,
            default: '[[player]][[stakedCrop]]plots[[plotId]]',
          },
        },
        variables: {
          player: {
            type: 'address',
            value: player,
          },
          plotId: {
            type: 'number',
            value: plotId,
          },
          stakedCrop: {
            type: 'contextAction',
            value: CropXyzContextActionEnum.STAKED_CROP,
          },
        },
      };
      return transaction;
    }
  }

  return transaction;
}

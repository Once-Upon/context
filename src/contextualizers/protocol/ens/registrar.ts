import { Hex } from 'viem';
import {
  ENSContextActionEnum,
  EventLogTopics,
  Transaction,
} from '../../../types';
import { ENS_CONTRACTS, ENS_ADDRESSES } from './constants';
import {
  convertDate,
  decodeLog,
  grabLogsFromTransaction,
} from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  const logs = grabLogsFromTransaction(transaction);
  // detect logs
  if (logs.length === 0) {
    return false;
  }

  for (const log of logs) {
    if (
      log.address !== ENS_ADDRESSES.registrarV2 &&
      log.address !== ENS_ADDRESSES.registrarV3
    ) {
      continue;
    }

    const abi = ENS_CONTRACTS.registrar[log.address].abi;
    const decodedLog = decodeLog(
      abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decodedLog) continue;

    if (
      decodedLog.eventName === 'NameRegistered' ||
      decodedLog.eventName === 'NameRenewed'
    ) {
      return true;
    }
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const logs = grabLogsFromTransaction(transaction);
  if (logs.length === 0) return transaction;

  for (const log of logs) {
    if (
      log.address !== ENS_ADDRESSES.registrarV2 &&
      log.address !== ENS_ADDRESSES.registrarV3
    ) {
      continue;
    }

    const abi = ENS_CONTRACTS.registrar[log.address].abi;
    const decodedLog = decodeLog(
      abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decodedLog) continue;

    switch (decodedLog.eventName) {
      case 'NameRegistered': {
        const name = decodedLog.args['name'];
        const expires = Number(decodedLog.args['expires']);
        const expireDate = convertDate(expires);

        transaction.context = {
          summaries: {
            category: 'IDENTITY',
            en: {
              title: 'ENS',
              default: `[[registerer]][[registered]][[name]]with an expiration of[[expireDate]]`,
            },
          },
          variables: {
            registerer: {
              type: 'address',
              value: transaction.from,
            },
            name: {
              type: 'string',
              emphasis: true,
              value: `${name}.eth`,
            },
            expireDate: {
              type: 'string',
              emphasis: true,
              value: expireDate,
            },
            registered: {
              type: 'contextAction',
              value: ENSContextActionEnum.REGISTERED,
            },
          },
        };

        return transaction;
      }

      case 'NameRenewed': {
        const name = decodedLog.args['name'];
        const expires = Number(decodedLog.args['expires']);
        const expireDate = convertDate(expires);

        transaction.context = {
          summaries: {
            category: 'IDENTITY',
            en: {
              title: 'ENS',
              default: `[[renewer]][[renewed]][[name]]with an expiration of[[expireDate]]`,
            },
          },
          variables: {
            renewer: {
              type: 'address',
              value: transaction.from,
            },
            name: {
              type: 'string',
              emphasis: true,
              value: `${name}.eth`,
            },
            expireDate: {
              type: 'string',
              emphasis: true,
              value: expireDate,
            },
            renewed: {
              type: 'contextAction',
              value: ENSContextActionEnum.RENEWED,
            },
          },
        };

        return transaction;
      }

      default: {
        return transaction;
      }
    }
  }
  return transaction;
};

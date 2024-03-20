import { Hex } from 'viem';
import { EventLogTopics, Transaction } from '../../types';
import { ENS_CONTRACTS, ENS_ADDRESSES } from './constants';
import { convertDate, decodeLog } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // detect logs
  if (!transaction.logs) {
    return false;
  }

  for (const log of transaction.logs) {
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
      log.topics as EventLogTopics,
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
  if (!transaction.logs) return transaction;

  for (const log of transaction.logs) {
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
      log.topics as EventLogTopics,
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
              default: `[[registerer]][[registered]][[name]]expires on[[expireDate]]`,
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
              value: 'REGISTERED',
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
              default: `[[renewer]][[renewed]][[name]]expires on[[expireDate]]`,
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
              value: 'RENEWED',
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

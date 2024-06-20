import { Hex } from 'viem';
import {
  EASContextActionEnum,
  EventLogTopics,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { decodeTransactionInput, decodeLog } from '../../../helpers/utils';
import { ABIs, EAS_LINKS } from './constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBundler = detect(transaction);
  if (!isBundler) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  try {
    if (!transaction.to) {
      return false;
    }

    // NOTE: There is one other contract deployed on mainnet that has the same function
    // signature for 'register' so we filter out transactions to that contract
    if (
      transaction.to === '0xD85Fac03804a3e44D29c494f3761D11A2262cBBe' &&
      transaction.chainId === 1
    ) {
      return false;
    }

    // decode input
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.SchemaRegistry,
    );

    if (!decoded || !decoded.functionName) return false;
    return ['register'].includes(decoded.functionName);
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.SchemaRegistry,
  );
  if (!decoded) {
    return transaction;
  }
  if (!transaction.chainId) return transaction;

  switch (decoded.functionName) {
    case 'register': {
      let id = '';
      if (transaction.receipt?.status) {
        const registerLog = transaction.logs?.find((log) => {
          const decoded = decodeLog(
            ABIs.SchemaRegistry,
            log.data as Hex,
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
          );
          if (!decoded) return false;

          return decoded.eventName === 'Registered';
        });

        if (registerLog) {
          const decoded = decodeLog(
            ABIs.SchemaRegistry,
            registerLog.data as Hex,
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
          );
          if (!decoded) return transaction;

          id = decoded.args['uid'];
        }
      }

      const code = decoded.args[0];
      transaction.context = {
        actions: [`${Protocols.EAS}.${EASContextActionEnum.REGISTERED}`],

        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          id: {
            type: 'link',
            value: id,
            truncate: true,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/schema/view/${id}`
              : '',
          },
          schema: {
            type: 'code',
            value: code,
          },
          registered: {
            type: 'contextAction',
            id: `${Protocols.EAS}.${EASContextActionEnum.REGISTERED}`,
            value: EASContextActionEnum.REGISTERED,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.EAS],
            default: '[[from]][[registered]]new schema with id[[id]]',
            long: '[[from]][[registered]]new schema with id[[id]]and schema[[schema]]',
          },
        },
      };
      return transaction;
    }

    default: {
      return transaction;
    }
  }
};

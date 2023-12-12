import { Interface, TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { decodeTransactionInput } from '../../helpers/utils';
import { ABIs } from './constants';

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

    // decode input
    let decoded: TransactionDescription;
    try {
      decoded = decodeTransactionInput(transaction.input, ABIs.SchemaRegistry);
    } catch (_) {
      return false;
    }

    if (!decoded || !decoded.name) return false;
    return ['register'].includes(decoded.name);
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input,
    ABIs.SchemaRegistry,
  );

  switch (decoded.name) {
    case 'register': {
      let id = '';
      if (transaction.receipt?.status) {
        const registerLog = transaction.logs?.find((log) => {
          try {
            const iface = new Interface(ABIs.SchemaRegistry);
            const decoded = iface.parseLog({
              topics: log.topics,
              data: log.data,
            });
            return decoded.name === 'Registered';
          } catch (_) {
            return false;
          }
        });

        if (registerLog) {
          try {
            const iface = new Interface(ABIs.SchemaRegistry);
            const decoded = iface.parseLog({
              topics: registerLog.topics,
              data: registerLog.data,
            });
            id = decoded.args.uid.toString();
          } catch (err) {
            console.error(err);
          }
        }
      }

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          id: {
            type: 'emphasis',
            value: id,
          },
          registered: {
            type: 'contextAction',
            value: 'REGISTERED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[registered]] new schema with id [[id]]',
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

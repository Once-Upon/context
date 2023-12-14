import { Abi } from 'viem';
import { Interface } from 'ethers/lib/utils';
import { HexadecimalString, Transaction } from '../../types';
import { decodeTransactionInputViem } from '../../helpers/utils';
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
    let decoded;
    try {
      decoded = decodeTransactionInputViem(
        transaction.input as HexadecimalString,
        ABIs.SchemaRegistry as Abi,
      );
    } catch (_) {
      return false;
    }

    if (!decoded || !decoded.functionName) return false;
    return ['register'].includes(decoded.functionName);
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInputViem(
    transaction.input as HexadecimalString,
    ABIs.SchemaRegistry as Abi,
  );

  switch (decoded.functionName) {
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

      const code = decoded.args[0] as string;
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          id: {
            type: 'schemaID',
            value: id,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${id}`
              : '',
          },
          schema: {
            type: 'code',
            value: code,
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
            long: '[[from]] [[registered]] new schema with id [[id]] and schema [[schema]]',
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

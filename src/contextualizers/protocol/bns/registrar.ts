import { Hex } from 'viem';
import {
  BNSContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { BNS_ADDRESSES, BNS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBNS = detect(transaction);
  if (!isBNS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== BNS_ADDRESSES.baseRegistrar) {
    return false;
  }

  const abi = BNS_CONTRACTS.registrar[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return false;

  if (
    decode.functionName === 'registerWithSignature' ||
    decode.functionName === 'renewWithSignature'
  ) {
    return true;
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (transaction.to !== BNS_ADDRESSES.baseRegistrar) {
    return transaction;
  }

  const abi = BNS_CONTRACTS.registrar[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return transaction;

  switch (decode.functionName) {
    case 'registerWithSignature': {
      const name = decode.args[0]['name'];
      const duration = Number(decode.args[0]['duration']);
      const durationInDays = Math.trunc(duration / 60 / 60 / 24);

      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: ProtocolMap[Protocols.BNS],
            default: `[[registerer]][[registered]][[name]]for[[duration]]`,
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
            value: `${name}.base`,
          },
          duration: {
            type: 'number',
            emphasis: true,
            value: durationInDays,
            unit: 'days',
          },
          registered: {
            type: 'contextAction',
            id: `${Protocols.BNS}.${BNSContextActionEnum.REGISTERED}`,
            value: BNSContextActionEnum.REGISTERED,
          },
        },
      };

      return transaction;
    }

    case 'renewWithSignature': {
      const name = decode.args[0]['name'];
      const duration = Number(decode.args[0]['duration']);
      const durationInDays = Math.trunc(duration / 60 / 60 / 24);

      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: ProtocolMap[Protocols.BNS],
            default: `[[renewer]][[renewed]][[name]]for[[duration]]`,
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
            value: `${name}.base`,
          },
          duration: {
            type: 'number',
            emphasis: true,
            value: durationInDays,
            unit: 'days',
          },
          renewed: {
            type: 'contextAction',
            id: `${Protocols.BNS}.${BNSContextActionEnum.RENEWED}`,
            value: BNSContextActionEnum.RENEWED,
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

import { Hex } from 'viem';
import type { PseudoTransaction } from '../../../../types';
import { decodeTransactionInput } from '../../../../helpers/utils';

// TODO source unknown
const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      { internalType: 'uint8', name: 'operation', type: 'uint8' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        name: '_params',
        type: 'tuple[]',
      },
    ],
    name: 'executeBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const decode = (transaction: PseudoTransaction) => {
  const decoded = decodeTransactionInput(transaction.input as Hex, abi);

  if (decoded?.functionName === 'execute') {
    const [to, value, input] = decoded.args;

    return [{ to, value, input }];
  } else if (decoded?.functionName === 'executeBatch') {
    return decoded.args[0].map(({ to, value, data }) => ({
      to,
      value,
      input: data,
    }));
  }
};

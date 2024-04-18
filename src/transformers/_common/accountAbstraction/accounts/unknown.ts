import { Hex } from 'viem';
import type { PseudoTransaction } from '../../../../types';
import { decodeTransactionInput } from '../../../../helpers/utils';

// Source unknown
// To find this, looked at transactions to the EntryPoint contract
// and saw that many of them were from accounts using this these signatures.

// Method for finding them:
// - Look at transactions to the EntryPoint
// - Reverse lookup the function signature using tenderly or openchain
// - Search for the function signature on github/google

// For this one, couldn't find the source code anywhere
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

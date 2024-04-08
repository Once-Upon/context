import { Hex } from 'viem';
import type { PseudoTransaction } from '../../../../types';
import { decodeTransactionInput } from '../../../../helpers/utils';

// https://github.com/okx/AccountAbstraction/blob/main/contracts/wallet/v2/SmartAccountV2.sol
// https://github.com/okx/AccountAbstraction/blob/main/contracts/wallet/v1/SmartAccount.sol

const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'execTransactionFromEntrypoint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'allowFailed', type: 'bool' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'nestedCalls', type: 'bytes' },
        ],
        internalType: 'struct Executor.ExecuteParams[]',
        name: '_params',
        type: 'tuple[]',
      },
    ],
    name: 'execTransactionFromEntrypointBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'bool', name: 'allowFailed', type: 'bool' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
          { internalType: 'bytes', name: 'nestedCalls', type: 'bytes' },
        ],
        internalType: 'struct Executor.ExecuteParams[]',
        name: '_params',
        type: 'tuple[]',
      },
    ],
    name: 'execTransactionFromEntrypointBatchRevertOnFail',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      {
        internalType: 'enum Enum.Operation',
        name: 'operation',
        type: 'uint8',
      },
    ],
    name: 'execTransactionFromModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export const decode = (transaction: PseudoTransaction) => {
  const decoded = decodeTransactionInput(transaction.input as Hex, abi);

  if (decoded?.functionName === 'execTransactionFromEntrypoint') {
    const [to, value, input] = decoded.args;

    return [{ to, value, input }];
  }

  // TODO add support for execTransactionFromEntrypointBatch, execTransactionFromEntrypointBatchRevertOnFail, execTransactionFromModule
};

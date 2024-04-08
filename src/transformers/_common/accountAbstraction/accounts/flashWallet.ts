import { Hex } from 'viem';
import type { PseudoTransaction } from '../../../../types';
import { decodeTransactionInput } from '../../../../helpers/utils';

// https://github.com/0xProject/protocol/blob/development/contracts/zero-ex/contracts/src/external/FlashWallet.sol
const abi = [
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'bytes', name: 'callData', type: 'bytes' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'executeCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'target', type: 'address' },
      { internalType: 'bytes', name: 'callData', type: 'bytes' },
    ],
    name: 'executeDelegateCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const decode = (transaction: PseudoTransaction) => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    abi,
  );

  if (decoded?.functionName === 'executeCall') {
    const [to, input, value] = decoded.args;

    return [{ to, value, input }];
  } else if (decoded?.functionName === 'executeDelegateCall') {
    const [to, input] = decoded.args;

    return [{ to, input, value: 0n }];
  }
};

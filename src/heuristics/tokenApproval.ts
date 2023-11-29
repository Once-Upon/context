import { Transaction } from '../types';

export function tokenApprovalContextualizer(
  transaction: Transaction,
): Transaction {
  const isTokenApproval = detectTokenApproval(transaction);
  if (!isTokenApproval) return transaction;

  return generateTokenApprovalContext(transaction);
}

export function detectTokenApproval(transaction: Transaction): boolean {
  if (!transaction.decode) {
    return false;
  }

  const { args } = transaction.decode;
  if (!args) {
    return false;
  }

  // Token approve
  if (
    transaction.decode?.fragment.name === 'approve' &&
    transaction.decode.fragment.inputs.length === 2 &&
    transaction.decode.fragment.inputs[0].type === 'address' &&
    transaction.decode.fragment.inputs[1].type === 'uint256' &&
    !transaction.assetTransfers?.length &&
    transaction.value === '0'
  ) {
    return true;
  } else if (
    transaction.decode?.fragment.name === 'setApprovalForAll' &&
    transaction.decode.fragment.inputs.length === 2 &&
    transaction.decode.fragment.inputs[0].type === 'address' &&
    transaction.decode.fragment.inputs[1].type === 'bool' &&
    !transaction.assetTransfers?.length &&
    transaction.value === '0'
  ) {
    return true;
  }

  return false;
}

function generateTokenApprovalContext(transaction: Transaction): Transaction {
  const { args } = transaction.decode;
  const approver = transaction.from;
  const token = transaction.to;
  const operator = args[0];

  transaction.context = {
    variables: {
      approver: {
        type: 'address',
        value: approver,
      },
      operator: {
        type: 'address',
        value: operator,
      },
      token: {
        type: 'address',
        value: token,
      },
    },
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'Token Approval',
        default: '[[approver]] [[gaveAccessTo]] [[operator]] for [[token]]',
        variables: {
          gaveAccessTo: {
            type: 'contextAction',
            value: 'gave access to',
          },
        },
      },
    },
  };

  return transaction;
}

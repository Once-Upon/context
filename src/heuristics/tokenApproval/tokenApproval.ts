import { Hex } from 'viem';
import { Transaction } from '../../types';
import approveAbi from './abis/Approve';
import setApprovalForAllAbi from './abis/SetApprovalForAll';
import { decodeTransactionInput } from '../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isTokenApproval = detect(transaction);
  if (!isTokenApproval) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // decode transaction
  let decoded;
  decoded = decodeTransactionInput(transaction.input as Hex, approveAbi);
  if (!decoded) {
    decoded = decodeTransactionInput(
      transaction.input as Hex,
      setApprovalForAllAbi,
    );
  }

  if (!decoded) {
    return false;
  }

  const { args } = decoded;
  if (!args) {
    return false;
  }

  // Token approve
  if (
    decoded.functionName === 'approve' &&
    decoded.args.length === 2 &&
    !transaction.assetTransfers?.length &&
    transaction.value === BigInt(0)
  ) {
    return true;
  } else if (
    decoded.functionName === 'setApprovalForAll' &&
    decoded.args.length === 2 &&
    !transaction.assetTransfers?.length &&
    transaction.value === BigInt(0)
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.to) return transaction;

  // decode transaction
  let decoded;
  decoded = decodeTransactionInput(transaction.input as Hex, approveAbi);
  if (!decoded) {
    decoded = decodeTransactionInput(
      transaction.input as Hex,
      setApprovalForAllAbi,
    );
  }
  if (!decoded) {
    return transaction;
  }

  const { args } = decoded;
  const approver = transaction.from;
  const token = transaction.to;
  const operator = args[0].toLowerCase();

  switch (decoded.functionName) {
    case 'approve':
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
          gaveAccess: {
            type: 'contextAction',
            value: 'GAVE_ACCESS',
          },
        },
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'Token Approval',
            default: '[[approver]][[gaveAccess]]to[[operator]]for[[token]]',
          },
        },
      };
      return transaction;
    case 'setApprovalForAll':
      const approved = args[1];
      if (approved === true) {
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
            gaveAccess: {
              type: 'contextAction',
              value: 'GAVE_ACCESS',
            },
          },
          summaries: {
            category: 'FUNGIBLE_TOKEN',
            en: {
              title: 'Token Approval',
              default: '[[approver]][[gaveAccess]]to[[operator]]for[[token]]',
            },
          },
        };
      } else {
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
            revokedAccess: {
              type: 'contextAction',
              value: 'REVOKED_ACCESS',
            },
          },
          summaries: {
            category: 'FUNGIBLE_TOKEN',
            en: {
              title: 'Token Approval',
              default:
                '[[approver]][[revokedAccess]]from[[operator]]for[[token]]',
            },
          },
        };
      }
      return transaction;
    default:
      return transaction;
  }
}

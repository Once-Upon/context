import { Transaction } from '../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isTokenApproval = detect(transaction);
  if (!isTokenApproval) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
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

export function generate(transaction: Transaction): Transaction {
  if (!transaction.decode || !transaction.to) return transaction;

  const { args } = transaction.decode;
  const approver = transaction.from;
  const token = transaction.to;
  const operator = args[0];

  switch (transaction.decode?.fragment.name) {
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
            default:
              '[[approver]] [[gaveAccess]] to [[operator]] for [[token]]',
          },
        },
      };
      return transaction;
    case 'setApprovalForAll':
      const approved = args[1];
      if (approved === 'true') {
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
              default:
                '[[approver]] [[gaveAccess]] to [[operator]] for [[token]]',
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
                '[[approver]] [[revokedAccess]] from [[operator]] for [[token]]',
            },
          },
        };
      }
      return transaction;
    default:
      return transaction;
  }
}

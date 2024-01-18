import { Hex } from 'viem';
import { EventLogTopics, Transaction } from '../../types';
import { NounsContracts, ABIs } from './constants';
import { decodeLog, decodeTransactionInput } from '../../helpers/utils';

const translateSupport = (support: number) => {
  if (support === 0) return 'VOTED_AGAINST';
  if (support === 1) return 'VOTED_FOR';

  return 'ABSTAINED';
};

const FUNCTION_CONTEXT_ACTION_MAPPING = {
  execute: 'EXECUTED',
  queue: 'QUEUED',
  cancel: 'CANCELED',
  veto: 'VETOED',
} as const;

export const contextualize = (transaction: Transaction): Transaction => {
  const isNouns = detect(transaction);
  if (!isNouns) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.to) {
    return false;
  }

  if (transaction.to !== NounsContracts.DAOLogic) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.NounsDAOLogicV3,
    );
    if (!decoded) return false;

    if (
      decoded.functionName !== 'propose' &&
      decoded.functionName !== 'castVote' &&
      decoded.functionName !== 'castVoteWithReason' &&
      decoded.functionName !== 'castVoteBySig' &&
      decoded.functionName !== 'castRefundableVote' &&
      decoded.functionName !== 'castRefundableVoteWithReason' &&
      decoded.functionName !== 'queue' &&
      decoded.functionName !== 'execute' &&
      decoded.functionName !== 'cancel' &&
      decoded.functionName !== 'veto'
    ) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.NounsDAOLogicV3,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'propose': {
      let proposalId: bigint = BigInt(0);

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            log.data as Hex,
            log.topics as EventLogTopics,
          );
          if (!decoded) return false;
          return decoded.eventName === 'ProposalCreated';
        } catch (_) {
          return false;
        }
      });

      if (registerLog) {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            registerLog.data as Hex,
            registerLog.topics as EventLogTopics,
          );
          if (!decoded) return transaction;

          proposalId = decoded.args['id'];
        } catch (err) {
          console.error(err);
        }
      }

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: 'CREATED_PROPOSAL',
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'number',
            value: Number(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]] [[contextAction]] [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'castRefundableVote':
    case 'castRefundableVoteWithReason':
    case 'castVote':
    case 'castVoteWithReason': {
      const proposalId = decoded.args[0];
      const support = decoded.args[1];
      const action = translateSupport(support);

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: action,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'number',
            value: Number(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]] [[contextAction]] ${
              action === 'ABSTAINED' ? 'from voting on ' : ''
            }proposal [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'castVoteBySig': {
      const proposalId = decoded.args[0];
      const support = decoded.args[1];
      const action = translateSupport(support);

      let voter: string = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            log.data as Hex,
            log.topics as EventLogTopics,
          );
          if (!decoded) return false;
          return decoded.eventName === 'VoteCast';
        } catch (_) {
          return false;
        }
      });

      if (registerLog) {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            registerLog.data as Hex,
            registerLog.topics as EventLogTopics,
          );

          if (!decoded) return transaction;

          voter = decoded.args['voter'];
        } catch (err) {
          console.error(err);
        }
      }

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: action,
          },
          voter: {
            type: 'address',
            value: voter,
          },
          proposalId: {
            type: 'number',
            value: Number(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[voter]] [[contextAction]] ${
              action === 'ABSTAINED' ? 'from voting on ' : ''
            }proposal [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'execute':
    case 'queue':
    case 'cancel':
    case 'veto': {
      const proposalId = decoded.args[0];

      const contextAction =
        FUNCTION_CONTEXT_ACTION_MAPPING[decoded.functionName];

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: contextAction,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'number',
            value: Number(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]] [[contextAction]] proposal [[proposalId]]`,
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

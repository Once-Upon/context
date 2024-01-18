import { Hex } from 'viem';
import { EventLogTopics, Transaction } from '../../types';
import { ABIs, NOUNS_BUILDER_INSTANCES } from './constants';
import { NounsContracts } from '../nouns/constants';
import { decodeLog, decodeTransactionInput } from '../../helpers/utils';

const translateSupport = (support: bigint) => {
  if (support === 0n) return 'VOTED_AGAINST';
  if (support === 1n) return 'VOTED_FOR';

  return 'ABSTAINED';
};

const daoByAuctionGovernorContract = (address: string) => {
  return NOUNS_BUILDER_INSTANCES.find((v) => v.governor === address);
};

const FUNCTION_CONTEXT_ACTION_MAPPING = {
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

  if (transaction.to === NounsContracts.DAOLogic) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.IGovernor,
    );

    if (!decoded) return false;

    if (
      decoded.functionName !== 'propose' &&
      decoded.functionName !== 'castVote' &&
      decoded.functionName !== 'castVoteWithReason' &&
      decoded.functionName !== 'castVoteBySig' &&
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
    ABIs.IGovernor,
  );

  if (!decoded) return transaction;

  if (!transaction.to) return transaction;
  const daoName: string =
    daoByAuctionGovernorContract(transaction.to)?.name ?? '';
  switch (decoded.functionName) {
    case 'propose': {
      const description = decoded.args[3];
      let proposalId = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.IGovernor,
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
            ABIs.IGovernor,
            registerLog.data as Hex,
            registerLog.topics as EventLogTopics,
          );

          if (!decoded) return transaction;

          proposalId = decoded.args['proposalId'];
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
          dao: {
            type: 'string',
            value: daoName,
          },
          proposalId: {
            type: 'string',
            value: proposalId,
          },
          description: {
            type: 'string',
            value: description,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'DAO',
            default: `[[subject]] [[contextAction]] [[proposalId]]${
              daoName ? ' in [[dao]] DAO' : ''
            }`,
          },
        },
      };

      return transaction;
    }

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
            type: 'string',
            value: proposalId,
          },
          dao: {
            type: 'string',
            value: daoName,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'DAO',
            default: `[[subject]] [[contextAction]] ${
              action === 'ABSTAINED' ? 'from voting on ' : ''
            }${
              daoName ? '[[dao]] DAO ' : ''
            }proposal [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'castVoteBySig': {
      const voter = decoded.args[0];
      const proposalId = decoded.args[1];
      const support = decoded.args[2];
      const action = translateSupport(support);

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
            type: 'string',
            value: proposalId,
          },
          dao: {
            type: 'string',
            value: daoName,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'DAO',
            default: `[[subject]] [[contextAction]] ${
              action === 'ABSTAINED' ? 'from voting on ' : ''
            }${
              daoName ? '[[dao]] DAO ' : ''
            }proposal [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'execute': {
      let proposalId = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.IGovernor,
            log.data as Hex,
            log.topics as EventLogTopics,
          );
          if (!decoded) return false;
          return decoded.eventName === 'ProposalExecuted';
        } catch (_) {
          return false;
        }
      });

      if (registerLog) {
        try {
          const decoded = decodeLog(
            ABIs.IGovernor,
            registerLog.data as Hex,
            registerLog.topics as EventLogTopics,
          );
          if (!decoded) return transaction;

          proposalId = decoded.args['proposalId'];
        } catch (err) {
          console.error(err);
        }
      }
      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: 'EXECUTED',
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'string',
            value: proposalId,
          },
          dao: {
            type: 'string',
            value: daoName,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'DAO',
            default: `[[subject]] [[contextAction]] ${
              daoName ? '[[dao]] DAO ' : ''
            }proposal [[proposalId]]`,
          },
        },
      };

      return transaction;
    }

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
            type: 'string',
            value: proposalId,
          },
          dao: {
            type: 'string',
            value: daoName,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'DAO',
            default: `[[subject]] [[contextAction]] ${
              daoName ? '[[dao]] DAO ' : ''
            }proposal [[proposalId]]`,
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

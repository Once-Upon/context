import { Hex } from 'viem';
import { EventLogTopics, Transaction } from '../../types';
import { NounsContracts, ABIs, NOUNS_BUILDER_INSTANCES } from './constants';
import { decodeLog, decodeTransactionInput } from '../../helpers/utils';

const supportIntToString = (support: bigint) => {
  if (support === 0n) return 'against';
  if (support === 1n) return 'in favor of';

  return 'from voting on';
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

  if (transaction.to === NounsContracts.AuctionHouse) {
    return false;
  }
  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.IGovernor,
    );

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

  const daoName = daoByAuctionGovernorContract(transaction.to)?.name;

  switch (decoded.functionName) {
    case 'propose': {
      let proposalId = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.IGovernor,
            log.data as Hex,
            log.topics as EventLogTopics,
          );
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
      const vote = supportIntToString(support);
      const action = support > 1n ? 'ABSTAINED' : 'VOTED';

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
          vote: {
            type: 'string',
            value: vote,
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
            default: `[[subject]] [[contextAction]] [[vote]] ${
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
      const vote = supportIntToString(support);
      const action = support > 1n ? 'ABSTAINED' : 'VOTED';

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
          vote: {
            type: 'string',
            value: vote,
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
            default: `[[subject]] [[contextAction]] [[vote]] ${
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

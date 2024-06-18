import { Hex } from 'viem';
import {
  EventLogTopics,
  NounsGovernorActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { NounsContracts, ABIs } from './constants';
import { decodeLog, decodeTransactionInput } from '../../../helpers/utils';

const translateSupport = (support: number) => {
  if (support === 0) return NounsGovernorActionEnum.VOTED_AGAINST;
  if (support === 1) return NounsGovernorActionEnum.VOTED_FOR;

  return NounsGovernorActionEnum.ABSTAINED;
};

const proposalUrl = (proposalId: bigint | number) => {
  return `https://nouns.camp/proposals/${proposalId}`;
};

const FUNCTION_CONTEXT_ACTION_MAPPING = {
  execute: NounsGovernorActionEnum.EXECUTED,
  queue: NounsGovernorActionEnum.QUEUED,
  cancel: NounsGovernorActionEnum.CANCELED,
  veto: NounsGovernorActionEnum.VETOED,
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
      decoded.functionName !== 'proposeBySigs' &&
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
      const description = decoded.args[4];

      let proposalId: bigint = BigInt(0);

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            log.data as Hex,
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
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
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
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
            id: `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.CREATED_PROPOSAL}`,
            value: NounsGovernorActionEnum.CREATED_PROPOSAL,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
          description: {
            type: 'string',
            value: description,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.NOUNS_GOVERNOR],
            default: `[[subject]][[contextAction]][[proposalId]]`,
          },
        },
      };

      return transaction;
    }

    case 'proposeBySigs': {
      const description = decoded.args[5];

      let proposalId: bigint = BigInt(0);

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.NounsDAOLogicV3,
            log.data as Hex,
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
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
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
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
            id: `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.CREATED_PROPOSAL}`,
            value: NounsGovernorActionEnum.CREATED_PROPOSAL,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
          description: {
            type: 'string',
            value: description,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.NOUNS_GOVERNOR],
            default: `[[subject]][[contextAction]][[proposalId]]`,
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

      let reason: string | undefined;
      if (
        decoded.functionName === 'castVoteWithReason' ||
        decoded.functionName === 'castRefundableVoteWithReason'
      ) {
        reason = decoded.args[2];
      }

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${action}`,
            value: action,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
          ...(reason
            ? {
                reason: {
                  type: 'string',
                  value: reason,
                },
              }
            : {}),
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.NOUNS_GOVERNOR],
            default: `[[subject]][[contextAction]]${
              action === NounsGovernorActionEnum.ABSTAINED
                ? 'from voting on '
                : ''
            }proposal[[proposalId]]`,
          },
        },
      };

      if (reason) {
        transaction.context!.summaries!.en.long = `[[subject]][[contextAction]]${
          action === NounsGovernorActionEnum.ABSTAINED ? 'from voting on ' : ''
        }proposal[[proposalId]][[reason]]`;
      }

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
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
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
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
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
            id: `${Protocols.NOUNS_GOVERNOR}.${action}`,
            value: action,
          },
          voter: {
            type: 'address',
            value: voter,
          },
          proposalId: {
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.NOUNS_GOVERNOR],
            default: `[[voter]][[contextAction]]${
              action === NounsGovernorActionEnum.ABSTAINED
                ? 'from voting on '
                : ''
            }proposal[[proposalId]]`,
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
            id: `${Protocols.NOUNS_GOVERNOR}.${contextAction}`,
            value: contextAction,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          proposalId: {
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.NOUNS_GOVERNOR],
            default: `[[subject]][[contextAction]]proposal[[proposalId]]`,
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

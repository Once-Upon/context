import { Hex } from 'viem';
import {
  ContextLinkType,
  ContextStringType,
  EventLogTopics,
  NounsGovernorActionEnum,
  Protocols,
  Transaction,
} from '../../../types';
import {
  ABIs,
  NOUNS_BUILDER_INSTANCES,
  NounsBuilderInstance,
} from './constants';
import { NounsContracts } from '../nouns/constants';
import { decodeLog, decodeTransactionInput } from '../../../helpers/utils';

const translateSupport = (support: bigint) => {
  if (support === 0n) return NounsGovernorActionEnum.VOTED_AGAINST;
  if (support === 1n) return NounsGovernorActionEnum.VOTED_FOR;

  return NounsGovernorActionEnum.ABSTAINED;
};

const daoByAuctionGovernorContract = (address: string) => {
  return NOUNS_BUILDER_INSTANCES.find((v) => v.governor === address);
};

const proposalUrl = (proposalId: string, dao: NounsBuilderInstance) => {
  return `https://nouns.build/dao/${dao.chain.networkName}/${dao.nft}/vote/${proposalId}`;
};

const FUNCTION_CONTEXT_ACTION_MAPPING = {
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
  const dao = daoByAuctionGovernorContract(transaction.to);

  const getDynamicVariables = (
    proposalId: string,
  ):
    | { dao: ContextStringType; proposalId: ContextLinkType }
    | { proposalId: ContextStringType } => {
    return dao
      ? {
          dao: {
            type: 'string',
            value: dao.name,
          },
          proposalId: {
            type: 'link',
            value: proposalId,
            truncate: true,
            link: proposalUrl(proposalId, dao),
          },
        }
      : {
          proposalId: {
            type: 'string',
            value: proposalId,
            truncate: true,
          },
        };
  };

  switch (decoded.functionName) {
    case 'propose': {
      const description = decoded.args[3];
      let proposalId = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.IGovernor,
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
            ABIs.IGovernor,
            registerLog.data as Hex,
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
          );

          if (!decoded) return transaction;

          proposalId = decoded.args['proposalId'];
        } catch (err) {
          console.error(err);
        }
      }

      transaction.context = {
        actions: [
          `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.CREATED_PROPOSAL}`,
        ],
        variables: {
          ...getDynamicVariables(proposalId),
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.CREATED_PROPOSAL}`,
            value: NounsGovernorActionEnum.CREATED_PROPOSAL,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          description: {
            type: 'string',
            value: description,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns Builder',
            default: `[[subject]][[contextAction]][[proposalId]]${
              dao?.name ? 'in[[dao]]DAO' : ''
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

      let reason: string | undefined;

      if (decoded.functionName === 'castVoteWithReason') {
        reason = decoded.args[2];
      }

      transaction.context = {
        actions: [`${Protocols.NOUNS_GOVERNOR}.${action}`],
        variables: {
          ...getDynamicVariables(proposalId),
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${action}`,
            value: action,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          ...(reason ? { reason: { type: 'string', value: reason } } : {}),
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns Builder',
            default: `[[subject]][[contextAction]]${
              action === NounsGovernorActionEnum.ABSTAINED
                ? 'from voting on'
                : ''
            }${dao?.name ? '[[dao]]DAO ' : ''}proposal[[proposalId]]`,
          },
        },
      };

      if (reason) {
        transaction.context!.summaries!.en.long = `[[subject]][[contextAction]]${
          action === NounsGovernorActionEnum.ABSTAINED ? 'from voting on' : ''
        }${dao?.name ? '[[dao]]DAO ' : ''}proposal[[proposalId]][[reason]]`;
      }

      return transaction;
    }

    case 'castVoteBySig': {
      const voter = decoded.args[0];
      const proposalId = decoded.args[1];
      const support = decoded.args[2];
      const action = translateSupport(support);

      transaction.context = {
        actions: [`${Protocols.NOUNS_GOVERNOR}.${action}`],
        variables: {
          ...getDynamicVariables(proposalId),
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${action}`,
            value: action,
          },
          voter: {
            type: 'address',
            value: voter,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns Builder',
            default: `[[subject]][[contextAction]]${
              action === NounsGovernorActionEnum.ABSTAINED
                ? 'from voting on'
                : ''
            }${dao?.name ? '[[dao]]DAO ' : ''}proposal[[proposalId]]`,
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
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
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
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
          );
          if (!decoded) return transaction;

          proposalId = decoded.args['proposalId'];
        } catch (err) {
          console.error(err);
        }
      }
      transaction.context = {
        actions: [
          `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.EXECUTED}`,
        ],
        variables: {
          ...getDynamicVariables(proposalId),
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${NounsGovernorActionEnum.EXECUTED}`,
            value: NounsGovernorActionEnum.EXECUTED,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns Builder',
            default: `[[subject]][[contextAction]]${
              dao?.name ? '[[dao]]DAO ' : ''
            }proposal[[proposalId]]`,
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
        actions: [`${Protocols.NOUNS_GOVERNOR}.${contextAction}`],
        variables: {
          ...getDynamicVariables(proposalId),
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.NOUNS_GOVERNOR}.${contextAction}`,
            value: contextAction,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns Builder',
            default: `[[subject]][[contextAction]]${
              dao?.name ? '[[dao]]DAO ' : ''
            }proposal[[proposalId]]`,
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

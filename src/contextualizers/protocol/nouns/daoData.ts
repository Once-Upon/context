import { Hex } from 'viem';
import { NounsGovernorActionEnum, Transaction } from '../../../types';
import { NounsContracts, ABIs } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';
import {
  translateSignalingSupport,
  proposalUrl,
  candidateUrl,
  candidateId,
} from './utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isNouns = detect(transaction);
  if (!isNouns) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.to) {
    return false;
  }

  if (transaction.to !== NounsContracts.DAOData) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.NounsDAOData,
    );
    if (!decoded) return false;

    if (
      decoded.functionName !== 'createProposalCandidate' &&
      decoded.functionName !== 'updateProposalCandidate' &&
      decoded.functionName !== 'cancelProposalCandidate' &&
      decoded.functionName !== 'addSignature' &&
      decoded.functionName !== 'sendFeedback' &&
      decoded.functionName !== 'sendCandidateFeedback' &&
      decoded.functionName !== 'setCreateCandidateCost' &&
      decoded.functionName !== 'setUpdateCandidateCost'
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
    ABIs.NounsDAOData,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'createProposalCandidate': {
      const [, , , , description, slug, proposalIdToUpdate] = decoded.args;

      const id = candidateId(transaction.from, slug);

      if (proposalIdToUpdate) {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.UPDATED_PROPOSAL,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            proposalId: {
              type: 'link',
              value: proposalIdToUpdate.toString(),
              link: proposalUrl(proposalIdToUpdate),
            },
            description: {
              type: 'string',
              value: description,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[proposalId]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.CREATED_CANDIDATE,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            candidateId: {
              type: 'link',
              value: id,
              link: candidateUrl(id),
              truncate: true,
            },
            description: {
              type: 'string',
              value: description,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[candidateId]]`,
            },
          },
        };
      }

      return transaction;
    }

    case 'updateProposalCandidate': {
      const [, , , , description, slug, proposalIdToUpdate, reason] =
        decoded.args;

      const id = candidateId(transaction.from, slug);

      if (proposalIdToUpdate) {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.UPDATED_PROPOSAL,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            proposalId: {
              type: 'link',
              value: proposalIdToUpdate.toString(),
              link: proposalUrl(proposalIdToUpdate),
            },
            description: {
              type: 'string',
              value: description,
            },
            reason: {
              type: 'string',
              value: reason,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[proposalId]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.UPDATED_CANDIDATE,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            candidateId: {
              type: 'link',
              value: id,
              link: candidateUrl(id),
              truncate: true,
            },
            description: {
              type: 'string',
              value: description,
            },
            reason: {
              type: 'string',
              value: reason,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[candidateId]]`,
            },
          },
        };
      }

      if (reason) {
        transaction.context!.summaries!.en.long =
          transaction.context!.summaries!.en.default + `[[reason]]`;
      }

      return transaction;
    }

    case 'addSignature': {
      const [
        ,
        _expirationTimestamp,
        proposer,
        slug,
        proposalIdToUpdate,
        _encodedProp,
        reason,
      ] = decoded.args;

      const id = candidateId(proposer, slug);

      if (proposalIdToUpdate) {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.SPONSORED_PROPOSAL,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            proposalId: {
              type: 'link',
              value: proposalIdToUpdate.toString(),
              link: proposalUrl(proposalIdToUpdate),
            },
            reason: {
              type: 'string',
              value: reason,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[proposalId]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            contextAction: {
              type: 'contextAction',
              value: NounsGovernorActionEnum.SPONSORED_CANDIDATE,
            },
            subject: {
              type: 'address',
              value: transaction.from,
            },
            candidateId: {
              type: 'link',
              value: id,
              link: candidateUrl(id),
              truncate: true,
            },
            reason: {
              type: 'string',
              value: reason,
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns',
              default: `[[subject]][[contextAction]][[candidateId]]`,
            },
          },
        };
      }

      if (reason) {
        transaction.context!.summaries!.en.long =
          transaction.context!.summaries!.en.default + `[[reason]]`;
      }

      return transaction;
    }

    case 'sendFeedback': {
      const [proposalId, support, reason] = decoded.args;
      const action = translateSignalingSupport(support);

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
            type: 'link',
            value: proposalId.toString(),
            link: proposalUrl(proposalId),
          },
          reason: {
            type: 'string',
            value: reason,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]][[contextAction]]proposal[[proposalId]]`,
          },
        },
      };

      if (reason) {
        transaction.context!.summaries!.en.long =
          transaction.context!.summaries!.en.default + `[[reason]]`;
      }

      return transaction;
    }

    case 'sendCandidateFeedback': {
      const [proposer, slug, support, reason] = decoded.args;
      const action = translateSignalingSupport(support);

      const id = candidateId(proposer, slug);

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
          candidateId: {
            type: 'link',
            value: id,
            link: candidateUrl(id),
            truncate: true,
          },
          reason: {
            type: 'string',
            value: reason,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]][[contextAction]]candidate[[candidateId]]`,
          },
        },
      };

      if (reason) {
        transaction.context!.summaries!.en.long =
          transaction.context!.summaries!.en.default + `[[reason]]`;
      }

      return transaction;
    }

    case 'cancelProposalCandidate': {
      const [slug] = decoded.args;

      const id = candidateId(transaction.from, slug);

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: NounsGovernorActionEnum.CANCELED_CANDIDATE,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          candidateId: {
            type: 'link',
            value: id,
            link: candidateUrl(id),
            truncate: true,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: `[[subject]][[contextAction]]candidate[[candidateId]]`,
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

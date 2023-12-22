import { Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../types';
import { NounsContracts, ABIs, NounsBuilderDAOMappings } from './constants';
import { decodeLog, decodeTransactionInput } from '../../helpers/utils';

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
      ABIs.IAuction,
    );

    if (
      decoded.functionName !== 'createBid' &&
      decoded.functionName !== 'settleCurrentAndCreateNewAuction' &&
      decoded.functionName !== 'settleAuction'
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
    ABIs.IAuction,
  );

  switch (decoded.functionName) {
    case 'createBid': {
      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: 'BID',
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          nounId: {
            type: 'string',
            value: decoded.args[0].toString(),
          },
          amount: {
            type: AssetType.ETH,
            value: transaction.value,
            unit: 'wei',
          },
        },
      };

      if (NounsBuilderDAOMappings[transaction.to]) {
        // If we have a mapping beteen nounsdao -> erc721, use that to show token
        transaction.context.variables.token = {
          type: AssetType.ERC721,
          token: NounsBuilderDAOMappings[transaction.to],
          tokenId: decoded.args[0].toString(),
        };
        transaction.context.summaries = {
          category: 'PROTOCOL_1',
          en: {
            title: 'NounsBuilder DAO',
            default: '[[subject]] [[contextAction]] [[amount]] on [[token]]',
          },
        };
      } else {
        // If not, use a generic tokenId
        transaction.context.variables.tokenId = {
          type: 'string',
          value: decoded.args[0].toString(),
        };
        transaction.context.summaries = {
          category: 'PROTOCOL_1',
          en: {
            title: 'NounsBuilder DAO',
            default:
              '[[subject]] [[contextAction]] [[amount]] on token #[[tokenId]]',
          },
        };
      }

      return transaction;
    }

    case 'settleAuction':
    case 'settleCurrentAndCreateNewAuction': {
      let tokenId = '';
      let winner = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.IAuction,
            log.data as Hex,
            log.topics as EventLogTopics,
          );
          return decoded.eventName === 'AuctionSettled';
        } catch (_) {
          return false;
        }
      });

      if (registerLog) {
        try {
          const decoded = decodeLog(
            ABIs.IAuction,
            registerLog.data as Hex,
            registerLog.topics as EventLogTopics,
          );

          tokenId = decoded.args['tokenId'];
          winner = decoded.args['winner'];
        } catch (err) {
          console.error(err);
        }
      }

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: 'SETTLED',
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          winner: {
            type: 'address',
            value: winner,
          },
        },
      };

      if (NounsBuilderDAOMappings[transaction.to]) {
        // If we have a mapping beteen nounsdao -> erc721, use that to show token
        transaction.context.variables.token = {
          type: AssetType.ERC721,
          token: NounsBuilderDAOMappings[transaction.to],
          tokenId: tokenId,
        };

        transaction.context.summaries = {
          category: 'PROTOCOL_1',
          en: {
            title: 'NounsBuilderDAO',
            default:
              '[[subject]] [[contextAction]] auction for [[token]] won by [[winner]]',
          },
        };
      } else {
        // If not, use a generic tokenId
        transaction.context.variables.tokenId = {
          type: 'string',
          value: tokenId,
        };
        transaction.context.summaries = {
          category: 'PROTOCOL_1',
          en: {
            title: 'NounsBuilder DAO',
            default:
              '[[subject]] [[contextAction]] auction for token #[[tokenId]] won by [[winner]]',
          },
        };
      }

      return transaction;
    }

    default: {
      return transaction;
    }
  }
};

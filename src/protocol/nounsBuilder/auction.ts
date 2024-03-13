import { Hex } from 'viem';
import { AssetType, ContextVariable, Transaction } from '../../types';
import { ABIs, NOUNS_BUILDER_INSTANCES } from './constants';
import { NounsContracts } from '../nouns/constants';
import { decodeLog, decodeTransactionInput } from '../../helpers/utils';

const daoByAuctionAuctionHouseContract = (address: string) => {
  return NOUNS_BUILDER_INSTANCES.find((v) => v.auctionHouse === address);
};

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

    if (!decoded) return false;

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

  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'createBid': {
      const variables: ContextVariable = {
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
      };

      if (!transaction.to) return transaction;

      const dao = daoByAuctionAuctionHouseContract(transaction.to);
      if (dao) {
        // If we have a mapping beteen nounsdao -> erc721, use that to show token
        variables.token = {
          type: AssetType.ERC721,
          token: dao.nft,
          tokenId: decoded.args[0].toString(),
        };

        transaction.context = {
          variables,
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns Builder',
              default: '[[subject]][[contextAction]][[amount]]on[[token]]',
            },
          },
        };
      } else {
        // If not, use a generic tokenId
        variables.tokenId = {
          type: 'string',
          value: decoded.args[0].toString(),
        };
        transaction.context = {
          variables,
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns Builder',
              default:
                '[[subject]][[contextAction]][[amount]]on token #[[tokenId]]',
            },
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
            log.topic0,
            log.topic1,
            log.topic2,
            log.topic3,
          );
          if (!decoded) return false;
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
            registerLog.topic0,
            registerLog.topic1,
            registerLog.topic2,
            registerLog.topic3,
          );

          if (!decoded) return transaction;

          tokenId = decoded.args['tokenId'].toString();
          winner = decoded.args['winner'];
        } catch (err) {
          console.error(err);
        }
      }

      const variables: ContextVariable = {
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
      };
      if (!transaction.to) return transaction;
      const dao = daoByAuctionAuctionHouseContract(transaction.to);
      if (dao) {
        // If we have a mapping beteen nounsdao -> erc721, use that to show token
        variables.token = {
          type: AssetType.ERC721,
          token: dao.nft,
          tokenId: tokenId,
        };

        transaction.context = {
          variables,
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns Builder',
              default:
                '[[subject]][[contextAction]]auction for[[token]]won by[[winner]]',
            },
          },
        };
      } else {
        variables.tokenId = {
          type: 'string',
          value: tokenId,
        };
        transaction.context = {
          variables,
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Nouns Builder',
              default:
                '[[subject]][[contextAction]]auction for token #[[tokenId]]won by[[winner]]',
            },
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

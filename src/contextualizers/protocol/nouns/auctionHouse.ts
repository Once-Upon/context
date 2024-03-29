import { Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../../types';
import { NounsContracts, ABIs } from './constants';
import {
  decodeLog,
  decodeTransactionInput,
  formatNativeToken,
} from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isNouns = detect(transaction);
  if (!isNouns) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.to) {
    return false;
  }

  if (transaction.to !== NounsContracts.AuctionHouse) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.NounsAuctionHouse,
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
  if (transaction.to !== NounsContracts.AuctionHouse) {
    return transaction;
  }
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.NounsAuctionHouse,
  );
  if (!decoded) return transaction;

  const chainId = transaction.chainId ?? 1;
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
          noun: {
            type: AssetType.ERC721,
            token: NounsContracts.NFT,
            tokenId: decoded.args[0].toString(),
          },
          amount: {
            type: formatNativeToken(chainId),
            value: transaction.value.toString(),
            unit: 'wei',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default: '[[subject]][[contextAction]][[amount]]on[[noun]]',
          },
        },
      };
      return transaction;
    }

    case 'settleAuction':
    case 'settleCurrentAndCreateNewAuction': {
      let nounId = '';
      let winner = '';

      const registerLog = transaction.logs?.find((log) => {
        try {
          const decoded = decodeLog(
            ABIs.NounsAuctionHouse,
            log.data as Hex,
            [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
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
            ABIs.NounsAuctionHouse,
            registerLog.data as Hex,
            [
              registerLog.topic0,
              registerLog.topic1,
              registerLog.topic2,
              registerLog.topic3,
            ] as EventLogTopics,
          );
          if (!decoded) return transaction;

          nounId = decoded.args['nounId'];
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
          noun: {
            type: AssetType.ERC721,
            token: NounsContracts.NFT,
            tokenId: nounId.toString(),
          },
          winner: {
            type: 'address',
            value: winner,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Nouns',
            default:
              '[[subject]][[contextAction]]auction for[[noun]]won by[[winner]]',
          },
        },
      };
    }

    default: {
      return transaction;
    }
  }
};

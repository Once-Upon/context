import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { decodeTransactionInput } from '../../helpers/utils';
import { FOUNDATION_ORIGINAL_MARKET, ABIs } from './constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFoundation = detect(transaction);
  if (!isFoundation) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.value) {
    return false;
  }

  if (transaction.to !== FOUNDATION_ORIGINAL_MARKET) {
    return false;
  }

  try {
    const iface = new Interface(ABIs.OriginalMarket);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['placeBidV2'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input,
    ABIs.OriginalMarket,
  );

  switch (decoded.name) {
    case 'placeBidV2': {
      // Capture auction ID
      let auctionID = '';
      if (transaction.receipt?.status) {
        const originalMarketLog = transaction.logs?.find((log) => {
          return log.address === FOUNDATION_ORIGINAL_MARKET;
        });
        if (originalMarketLog) {
          try {
            const iface = new Interface(ABIs.OriginalMarket);
            const decoded = iface.parseLog({
              topics: originalMarketLog.topics,
              data: originalMarketLog.data,
            });
            auctionID = decoded.args.auctionId.toString();
          } catch (e) {
            console.error(e);
          }
        }
      }
      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            value: 'PLACED_BID',
          },
          auctionID: {
            type: 'auctionID',
            value: auctionID,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Foundation',
            default: '[[subject]] [[contextAction]] on auction [[auctionID]]',
          },
        },
      };

      return transaction;
    }
  }
};

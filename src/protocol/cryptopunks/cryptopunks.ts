import { Hex } from 'viem';
import { ContextSummaryVariableType, Transaction } from '../../types';
import { CryptopunksContracts, CRYPTOPUNK_ABIS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.decode === null) {
    return false;
  }

  if (
    transaction.to !== CryptopunksContracts.Old &&
    transaction.to !== CryptopunksContracts.New
  ) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      CRYPTOPUNK_ABIS[transaction.to],
    );

    if (
      decoded.functionName !== 'getPunk' &&
      decoded.functionName !== 'offerPunkForSale' &&
      decoded.functionName !== 'withdrawBidForPunk' &&
      decoded.functionName !== 'enterBidForPunk' &&
      decoded.functionName !== 'withdraw' &&
      decoded.functionName !== 'buyPunk' &&
      decoded.functionName !== 'transferPunk' &&
      decoded.functionName !== 'punkNoLongerForSale' &&
      decoded.functionName !== 'offerPunkForSaleToAddress'
      //decoded.name !== 'acceptBidForPunk'  TODO!!!
    ) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    CRYPTOPUNK_ABIS[transaction.to],
  );

  switch (decoded.functionName) {
    case 'getPunk': {
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const minter: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            punk,
            minter,
            contextAction: {
              type: 'contextAction',
              value: 'MINTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Mint Punk',
              default: '[[minter]] [[contextAction]] [[punk]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            punk,
            minter,
            contextAction: {
              type: 'contextAction',
              value: 'MINTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Mint Punk',
              default: 'Failed: [[minter]] [[contextAction]] [[punk]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'offerPunkForSale': {
      const seller: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const price: ContextSummaryVariableType = {
        type: 'eth',
        value: (decoded.args[1] as bigint).toString(),
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            seller,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'LISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Offer Punk for Sale',
              default: '[[seller]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            seller,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'LISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Offer Punk for Sale',
              default:
                'Failed: [[seller]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'withdrawBidForPunk': {
      const bidder: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const price: ContextSummaryVariableType = {
        type: 'eth',
        value: transaction.assetTransfers?.[0].value,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            bidder,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'WITHDREW_BID_FOR',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Withdraw Bid for Punk',
              default: '[[bidder]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            bidder,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'WITHDREW_BID_FOR',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Withdraw Bid for Punk',
              default:
                'Failed: [[bidder]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'enterBidForPunk': {
      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const price: ContextSummaryVariableType = {
        type: 'eth',
        value: transaction.value,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            buyer,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'BID_ON_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Enter Bid for Punk',
              default: '[[buyer]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            buyer,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'BID_ON_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Enter Bid for Punk',
              default:
                'Failed: [[buyer]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'withdraw': {
      const withdrawer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const amount: ContextSummaryVariableType = {
        type: 'eth',
        value: transaction.assetTransfers?.[0].value,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            withdrawer,
            amount,
            contextAction: {
              type: 'contextAction',
              value: 'WITHDREW_FROM_CONTRACT',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Withdraw',
              default: '[[withdrawer]] [[contextAction]] [[amount]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            withdrawer,
            amount,
            contextAction: {
              type: 'contextAction',
              value: 'WITHDREW_FROM_CONTRACT',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Withdraw',
              default: 'Failed: [[withdrawer]] [[contextAction]] [[amount]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'buyPunk': {
      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const price: ContextSummaryVariableType = {
        type: 'eth',
        value: transaction.value,
      };
      if (transaction.receipt?.status) {
        const transferTopic = transaction.logs.filter(
          (log) =>
            log.topics[0] ===
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        )[0];
        const seller: ContextSummaryVariableType = {
          type: 'address',
          value: transferTopic.decode.args[0],
        };
        transaction.context = {
          variables: {
            buyer,
            punk,
            price,
            seller,
            contextAction: {
              type: 'contextAction',
              value: 'BOUGHT_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Buy Punk',
              default:
                '[[buyer]] [[contextAction]] [[punk]] from [[seller]] for [[price]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            buyer,
            punk,
            price,
            contextAction: {
              type: 'contextAction',
              value: 'BOUGHT_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Buy Punk',
              default:
                'Failed: [[buyer]] [[contextAction]] [[punk]] for [[price]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'transferPunk': {
      const sender: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[1] as bigint).toString(),
      };
      const receiver: ContextSummaryVariableType = {
        type: 'address',
        value: decoded.args[0] as string,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            sender,
            punk,
            receiver,
            contextAction: {
              type: 'contextAction',
              value: 'TRANSFERRED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Transfer Punk',
              default: '[[sender]] [[contextAction]] [[punk]] to [[receiver]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            sender,
            punk,
            receiver,
            contextAction: {
              type: 'contextAction',
              value: 'TRANSFERRED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Transfer Punk',
              default:
                'Failed: [[sender]] [[contextAction]] [[punk]] to [[receiver]]',
            },
          },
        };
      }
      return transaction;
    }
    case 'punkNoLongerForSale': {
      const seller: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            seller,
            punk,
            contextAction: {
              type: 'contextAction',
              value: 'UNLISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Punk No Longer for Sale',
              default: '[[seller]] [[contextAction]] [[punk]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            seller,
            punk,
            contextAction: {
              type: 'contextAction',
              value: 'UNLISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Punk No Longer for Sale',
              default: 'Failed: [[seller]] [[contextAction]] [[punk]]',
            },
          },
        };
      }

      return transaction;
    }
    case 'offerPunkForSaleToAddress': {
      const seller: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const punk: ContextSummaryVariableType = {
        type: 'erc721',
        token: CryptopunksContracts.New,
        tokenId: BigInt(decoded.args[0] as bigint).toString(),
      };
      const price: ContextSummaryVariableType = {
        type: 'eth',
        value: (decoded.args[1] as bigint).toString(),
      };
      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: decoded.args[2] as string,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          variables: {
            seller,
            punk,
            price,
            buyer,
            contextAction: {
              type: 'contextAction',
              value: 'LISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Offer Punk for Sale to Address',
              default:
                '[[seller]] [[contextAction]] [[punk]] to [[buyer]] for [[price]]',
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            seller,
            punk,
            price,
            buyer,
            contextAction: {
              type: 'contextAction',
              value: 'LISTED_PUNK',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Offer Punk for Sale to Address',
              default:
                'Failed: [[seller]] [[contextAction]] [[punk]] to [[buyer]] for [[price]]',
            },
          },
        };
      }
      return transaction;
    }
  }

  return transaction;
};

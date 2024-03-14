import { Hex } from 'viem';
import {
  AssetType,
  ContextSummaryVariableType,
  ETHAssetTransfer,
  Transaction,
} from '../../types';
import { CryptopunksContracts, CRYPTOPUNK_ABIS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.decoded === null) {
    return false;
  }

  if (
    transaction.to !== CryptopunksContracts.Old &&
    transaction.to !== CryptopunksContracts.New
  ) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    CRYPTOPUNK_ABIS[transaction.to],
  );

  if (!decoded) return false;

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
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (
    transaction.to !== CryptopunksContracts.Old &&
    transaction.to !== CryptopunksContracts.New
  ) {
    return transaction;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    CRYPTOPUNK_ABIS[transaction.to],
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'getPunk': {
      const punk: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
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
              title: 'CryptoPunks',
              default: '[[minter]][[contextAction]][[punk]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[minter]][[contextAction]][[punk]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
      };
      const price: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: decoded.args[1].toString(),
        unit: 'wei',
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
              title: 'CryptoPunks',
              default: '[[seller]][[contextAction]][[punk]]for[[price]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[seller]][[contextAction]][[punk]]for[[price]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
      };
      const ethAssetTransfer = transaction
        .assetTransfers?.[0] as ETHAssetTransfer;
      if (!ethAssetTransfer) return transaction;

      const price: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: ethAssetTransfer.value,
        unit: 'wei',
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
              title: 'CryptoPunks',
              default: '[[bidder]][[contextAction]][[punk]]for[[price]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[bidder]][[contextAction]][[punk]]for[[price]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
      };
      const price: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: transaction.value,
        unit: 'wei',
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
              title: 'CryptoPunks',
              default: '[[buyer]][[contextAction]][[punk]]for[[price]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[buyer]][[contextAction]][[punk]]for[[price]]',
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
      const ethAssetTransfer = transaction
        .assetTransfers?.[0] as ETHAssetTransfer;
      const amount: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: ethAssetTransfer.value,
        unit: 'wei',
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
              title: 'CryptoPunks',
              default: '[[withdrawer]][[contextAction]][[amount]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[withdrawer]][[contextAction]][[amount]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
      };
      const price: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: transaction.value,
        unit: 'wei',
      };
      if (transaction.receipt?.status) {
        const transferTopic = transaction.logs?.filter(
          (log) =>
            log.topic0 &&
            log.topic0 ===
              '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        )[0];
        if (!transferTopic || !transferTopic.decoded) return transaction;

        const seller: ContextSummaryVariableType = {
          type: 'address',
          // We put a decoded arg in your decoded args, so you can decode while you decode
          value: transferTopic.decoded.decoded[0].decoded,
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
              title: 'CryptoPunks',
              default:
                '[[buyer]][[contextAction]][[punk]]from[[seller]]for[[price]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[buyer]][[contextAction]][[punk]]for[[price]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[1].toString(),
      };
      const receiver: ContextSummaryVariableType = {
        type: 'address',
        value: decoded.args[0],
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
              title: 'CryptoPunks',
              default: '[[sender]][[contextAction]][[punk]]to[[receiver]]',
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
              title: 'CryptoPunks',
              default:
                'Failed:[[sender]][[contextAction]][[punk]]to[[receiver]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
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
              title: 'CryptoPunks',
              default: '[[seller]][[contextAction]][[punk]]',
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
              title: 'CryptoPunks',
              default: 'Failed:[[seller]][[contextAction]][[punk]]',
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
        type: AssetType.ERC721,
        token: CryptopunksContracts.New,
        tokenId: decoded.args[0].toString(),
      };
      const price: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: decoded.args[1].toString(),
        unit: 'wei',
      };
      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: decoded.args[2],
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
              title: 'CryptoPunks',
              default:
                '[[seller]][[contextAction]][[punk]]to[[buyer]]for[[price]]',
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
              title: 'CryptoPunks',
              default:
                'Failed:[[seller]][[contextAction]][[punk]]to[[buyer]]for[[price]]',
            },
          },
        };
      }
      return transaction;
    }
  }

  return transaction;
};

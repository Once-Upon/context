import { Abi, Hex } from 'viem';
import { BoomBoxContextActionEnum, Transaction } from '../../../types';
import { BOOMBOX_ABI, BOOMBOX_ARTIST_SPOTIFY_LINK } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';
import { CHAIN_IDS } from '../../../helpers/constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBoomBox = detect(transaction);
  if (!isBoomBox) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check chainId
  if (transaction.chainId !== CHAIN_IDS['stack']) return false;

  // decode input
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    BOOMBOX_ABI as Abi,
  );
  if (!decoded) return false;

  if (decoded.functionName !== 'setBatchTierCost') return false;

  return true;
};

// Contextualize for BoomBox txs
export const generate = (transaction: Transaction): Transaction => {
  // decode input
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    BOOMBOX_ABI as Abi,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'setBatchTierCost':
      const artistId = decoded.args ? decoded.args['_artistId'] : '';
      const cost = decoded.args ? decoded.args['_cost'] : '';
      console.log('cost', cost);

      transaction.context = {
        variables: {
          sender: {
            type: 'address',
            value: transaction.from,
          },
          artist: {
            type: 'link',
            value: 'link',
            truncate: true,
            link: `${BOOMBOX_ARTIST_SPOTIFY_LINK}/${artistId}`,
          },
          contextAction: {
            type: 'contextAction',
            value: BoomBoxContextActionEnum.SET_BATCH_TIER_COST,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'BoomBox',
            default: '[[sender]][[contextAction]]for[[artist]]',
          },
        },
      };
      return transaction;
    default:
      return transaction;
  }
};

import { Abi, Hex } from 'viem';
import { BoomboxContextActionEnum, Transaction } from '../../../types';
import {
  BOOMBOX_ABI,
  BOOMBOX_ARTIST_SPOTIFY_LINK,
  EVENT_DISTRIBUTE_TOPIC,
} from './constants';
import {
  decodeEVMAddress,
  decodeTransactionInput,
} from '../../../helpers/utils';
import { CHAIN_IDS } from '../../../helpers/constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBoombox = detect(transaction);
  if (!isBoombox) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check if stack chain
  if (transaction.chainId !== CHAIN_IDS['stack']) return false;

  // decode input
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    BOOMBOX_ABI as Abi,
  );
  if (!decoded) return false;

  if (
    decoded.functionName !== 'setBatchTierCost' &&
    decoded.functionName !== 'signArtist' &&
    decoded.functionName !== 'distribute'
  )
    return false;

  return true;
};

// Contextualize for Boombox txs
export const generate = (transaction: Transaction): Transaction => {
  // decode input
  const decoded = decodeTransactionInput(transaction.input as Hex, BOOMBOX_ABI);
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'setBatchTierCost':
      const _artistId =
        decoded.args && decoded.args.length > 1 ? decoded.args[0] : '';
      const cost =
        decoded.args && decoded.args.length > 1 ? decoded.args[1] : [];

      transaction.context = {
        variables: {
          sender: {
            type: 'address',
            value: transaction.from,
          },
          artist: {
            type: 'link',
            value: _artistId,
            truncate: true,
            link: `${BOOMBOX_ARTIST_SPOTIFY_LINK}/${_artistId}`,
          },
          cost: {
            type: 'array',
            value: cost.length > 0 ? cost.map((c: bigint) => c.toString()) : [],
          },
          contextAction: {
            type: 'contextAction',
            value: BoomboxContextActionEnum.ADDED,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Boombox',
            default: '[[sender]][[contextAction]][[artist]]on Spotify',
          },
        },
      };
      return transaction;
    case 'signArtist':
      const artistId =
        decoded.args && decoded.args.length > 1 ? decoded.args[0] : '';
      const user =
        decoded.args && decoded.args.length > 1 ? decoded.args[1] : '';
      const points =
        decoded.args && decoded.args.length > 1 ? decoded.args[2] : BigInt(0);

      transaction.context = {
        variables: {
          user: {
            type: 'address',
            value: user,
          },
          artist: {
            type: 'link',
            value: artistId,
            truncate: true,
            link: `${BOOMBOX_ARTIST_SPOTIFY_LINK}/${artistId}`,
          },
          points: {
            type: 'string',
            value: points.toString(),
          },
          contextAction: {
            type: 'contextAction',
            value: BoomboxContextActionEnum.SIGNED,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Boombox',
            default: '[[user]][[contextAction]][[artist]]',
          },
        },
      };
      return transaction;
    case 'distribute':
      const distributeArtistId =
        decoded.args && decoded.args.length > 0 ? decoded.args[0] : '';
      // decode logs
      const recipients = transaction.logs
        ? transaction.logs
            .filter((log) => log.topic0 === EVENT_DISTRIBUTE_TOPIC)
            .map((log) => decodeEVMAddress(log.topic2))
        : [];

      transaction.context = {
        variables: {
          sender: {
            type: 'address',
            value: transaction.from,
          },
          artist: {
            type: 'link',
            value: distributeArtistId,
            truncate: true,
            link: `${BOOMBOX_ARTIST_SPOTIFY_LINK}/${distributeArtistId}`,
          },
          recipients: {
            type: 'array',
            value: recipients,
          },
          contextAction: {
            type: 'contextAction',
            value: BoomboxContextActionEnum.DISTRIBUTED,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Boombox',
            default: '[[sender]][[contextAction]]for[[artist]]',
          },
        },
      };
      return transaction;
    default:
      return transaction;
  }
};

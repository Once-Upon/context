import { Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction, Log } from '../../../types';
import {
  MULTI_TOKEN_DROP_MARKET_ABI,
  MULTI_TOKEN_DROP_MARKET_CONTRACT,
} from './constants';
import { decodeLog } from '../../../helpers/utils';
import { generate as erc721Generate } from '../../heuristics/erc721Mint/erc721Mint';
import { generate as erc1155Generate } from '../../heuristics/erc1155Mint/erc1155Mint';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check if there is 'MintFromFixedPriceSale' log emitted
  const logs =
    transaction.logs && transaction.logs.length > 0 ? transaction.logs : [];
  const mintFromFixedPriceSaleLog = findMintFromFixedPriceSaleLog(logs);

  if (!mintFromFixedPriceSaleLog) return false;

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  // detect as heuristic erc721 or erc1155 mint
  transaction = erc721Generate(transaction);
  if (transaction.context?.summaries?.en.title !== 'NFT Mint') {
    transaction = erc1155Generate(transaction);
    if (transaction.context?.summaries?.en.title !== 'NFT Mint') {
      return transaction;
    }
  }
  // update category and title
  transaction.context.summaries.category = 'PROTOCOL_1';
  transaction.context.summaries.en.title = 'Rodeo';

  const logs =
    transaction.logs && transaction.logs.length > 0 ? transaction.logs : [];
  const mintFromFixedPriceSaleLog = findMintFromFixedPriceSaleLog(logs);
  if (!mintFromFixedPriceSaleLog) return transaction;
  const decodedLog = decodeLog(
    MULTI_TOKEN_DROP_MARKET_ABI,
    mintFromFixedPriceSaleLog.data as Hex,
    [
      mintFromFixedPriceSaleLog.topic0,
      mintFromFixedPriceSaleLog.topic1,
      mintFromFixedPriceSaleLog.topic2,
      mintFromFixedPriceSaleLog.topic3,
    ] as EventLogTopics,
  );
  if (
    !decodedLog ||
    !decodedLog.args['referrer'] ||
    !decodedLog.args['referrerReward']
  )
    return transaction;

  transaction.context.variables = {
    ...transaction.context.variables,
    numOfEth: {
      type: AssetType.ETH,
      value: decodedLog.args['referrerReward'].toString(),
      unit: 'wei',
    },
    mintReferral: {
      type: 'address',
      value: decodedLog.args['referrer'].toLowerCase(),
    },
  };

  transaction.context.summaries['en'].default +=
    'with[[numOfEth]]in rewards for[[mintReferral]]';

  return transaction;
};

const findMintFromFixedPriceSaleLog = (logs: Log[]): Log | undefined => {
  const mintFromFixedPriceSaleLog = logs.find((log) => {
    if (log.address !== MULTI_TOKEN_DROP_MARKET_CONTRACT) {
      return false;
    }
    const decodedLog = decodeLog(
      MULTI_TOKEN_DROP_MARKET_ABI,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decodedLog) return false;

    if (decodedLog.eventName !== 'MintFromFixedPriceSale') {
      return false;
    }

    return true;
  });

  return mintFromFixedPriceSaleLog;
};

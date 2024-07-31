import { Abi, Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../../types';
import { MINT_MANAGER_ABI, MINT_MANAGER_CONTRACT } from './constants';
import { decodeLog, grabLogsFromTransaction } from '../../../helpers/utils';
import { generate as erc721Generate } from '../../heuristics/erc721Mint/erc721Mint';
import { generate as erc1155Generate } from '../../heuristics/erc1155Mint/erc1155Mint';

export const contextualize = (transaction: Transaction): Transaction => {
  const isHighlight = detect(transaction);
  if (!isHighlight) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  // check if transaction is interacted with mint manager
  if (
    !transaction.chainId ||
    transaction.to !== MINT_MANAGER_CONTRACT[transaction.chainId]
  )
    return false;

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
  transaction.context.summaries.en.title = 'Highlight';

  // check if mint with rewards
  const logs = grabLogsFromTransaction(transaction);
  let decodedLog;
  for (const log of logs) {
    decodedLog = decodeLog(
      MINT_MANAGER_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );

    if (decodedLog && decodedLog.eventName === 'CreatorRewardPayout') break;
    decodedLog = null;
  }

  if (decodedLog) {
    const mintReferralAmount = decodedLog.args['amount'].toString();
    const mintReferralCurrency = decodedLog.args['currency'].toLowerCase();

    transaction.context.variables = {
      ...transaction.context.variables,
      vectorId: {
        type: 'number',
        value: decodedLog.args['vectorId'].toString(),
      },
      mintReferralRecipient: {
        type: 'address',
        value: decodedLog.args['rewardRecipient'].toLowerCase(),
      },
      mintReferralAmount:
        mintReferralCurrency !== '0x0000000000000000000000000000000000000000'
          ? {
              type: AssetType.ERC20,
              value: mintReferralAmount,
              token: mintReferralCurrency,
            }
          : {
              type: AssetType.ETH,
              value: mintReferralAmount,
              unit: 'wei',
            },
    };

    if (BigInt(mintReferralAmount) > BigInt(0)) {
      transaction.context.summaries['en'].default +=
        'with[[mintReferralAmount]]in rewards for[[mintReferralRecipient]]';
    }
  }

  return transaction;
};

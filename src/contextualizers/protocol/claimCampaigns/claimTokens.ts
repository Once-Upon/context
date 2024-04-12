import { Hex } from 'viem';
import {
  AssetType,
  ClaimCampaignsActionEnum,
  Transaction,
} from '../../../types';
import {
  CLAIM_CAMPAIGNS_ABI,
  ENJOY_CONTRACT_ADDRESS,
  ENJOY_CLAIM_CAMPAIGN_ID,
  CLAIM_CAMPAIGNS,
} from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!transaction.chainId) return false;
  if (transaction.to !== CLAIM_CAMPAIGNS[transaction.chainId]) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    CLAIM_CAMPAIGNS_ABI,
  );

  if (!decoded) return false;

  // should call "claimTokens" in ClaimCampaigns
  // with enjoy token claim id
  if (
    decoded.functionName !== 'claimTokens' ||
    !decoded.args[0] ||
    decoded.args[0].toLowerCase() !== ENJOY_CLAIM_CAMPAIGN_ID
  ) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    CLAIM_CAMPAIGNS_ABI,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'claimTokens': {
      transaction.context = {
        variables: {
          receiver: {
            type: 'address',
            value: transaction.from,
          },
          contextAction: {
            type: 'contextAction',
            value: ClaimCampaignsActionEnum.CLAIMED,
          },
          numTokens: {
            type: AssetType.ERC20,
            value: decoded.args[2].toString(),
            token: ENJOY_CONTRACT_ADDRESS,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Claim',
            default: '[[receiver]][[contextAction]][[numTokens]]',
          },
        },
      };
      return transaction;
    }
  }

  return transaction;
};

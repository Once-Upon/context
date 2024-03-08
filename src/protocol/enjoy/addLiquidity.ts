import { Hex } from 'viem';
import { AssetType, Transaction } from '../../types';
import { UNISWAP_V2_ROUTERS } from '../../helpers/constants';
import { UNISWAP_V2_ROUTER_ABI, ENJOY_CONTRACT_ADDRESS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== UNISWAP_V2_ROUTERS[transaction.chainId]) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    UNISWAP_V2_ROUTER_ABI,
  );

  if (!decoded) return false;

  // should call "addLiquidityETH" in uniswap v2 router
  // and deposit Enjoy token
  if (
    decoded.functionName !== 'addLiquidityETH' ||
    !decoded.args[0] ||
    decoded.args[0].toLowerCase() !== ENJOY_CONTRACT_ADDRESS
  ) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    UNISWAP_V2_ROUTER_ABI,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'addLiquidityETH': {
      transaction.context = {
        variables: {
          lp: {
            type: 'address',
            value: transaction.from,
          },
          contextAction: {
            type: 'contextAction',
            value: 'ADDED_LIQUIDITY',
          },
          numETH: {
            type: AssetType.ETH,
            value: transaction.value,
            unit: 'wei',
          },
          numENJOY: {
            type: AssetType.ERC20,
            value: decoded.args[2].toString(),
            token: ENJOY_CONTRACT_ADDRESS,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Uniswap',
            default: '[[lp]][[contextAction]]with[[numETH]]ETH and[[numENJOY]]',
          },
        },
      };
      return transaction;
    }
  }

  return transaction;
};

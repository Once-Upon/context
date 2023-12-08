import { Transaction } from '../../types';
import { contextualize as superchainFaucet } from './superchainFaucet';

const children = { superchainFaucet };

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const superchainFaucetContextualizer = {
  contextualize,
  children,
};

import { Transaction } from '../../types';
import { contextualize as weth } from './weth';

const children = { weth };

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const wethContextualizer = {
  contextualize,
  children,
};

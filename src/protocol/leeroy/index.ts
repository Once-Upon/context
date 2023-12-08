import { Transaction } from '../../types';
import { contextualize as leeroy } from './leeroy';

const children = { leeroy };

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const leeroyContextualizer = {
  contextualize,
  children,
};

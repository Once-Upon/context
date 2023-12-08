import { Transaction } from '../../types';
import { contextualize as ensRegistrar } from './registrar';
import { contextualize as ensReverse } from './reverse';

const children = { ensRegistrar, ensReverse };

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const ensContextualizer = {
  contextualize,
  children,
};

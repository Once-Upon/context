import { Transaction } from '../../types';
import { contextualize as ensRegistrarContextualizer } from './registrar';
import { contextualize as ensReverseContextualizer } from './reverse';

const children = { ensRegistrarContextualizer, ensReverseContextualizer };

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

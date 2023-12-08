import { Transaction } from '../../types';
import { contextualize as ensRegistrarContextualizer } from './registrar';
import { contextualize as ensReverseContextualizer } from './reverse';

const children = { ensRegistrarContextualizer, ensReverseContextualizer };

export const contextualize = (transaction: Transaction): Transaction => {
  const result = ensRegistrarContextualizer(transaction);
  if (result.context?.summaries?.category) {
    return result;
  }
  return ensReverseContextualizer(transaction);
};

export const ensContextualizer = {
  contextualize,
  children,
};

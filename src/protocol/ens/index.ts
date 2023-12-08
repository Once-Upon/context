import { Transaction } from '../../types';
import { ensContextualizer as ensRegistrarContextualizer } from './registrar';
import { ensReverseContextualizer } from './reverse';
export { ensRegistrarContextualizer, ensReverseContextualizer };

export const ensContextualizer = (transaction: Transaction): Transaction => {
  const result = ensRegistrarContextualizer(transaction);
  if (result.context?.summaries?.category) {
    return result;
  }
  return ensReverseContextualizer(transaction);
};

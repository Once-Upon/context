import { Transaction } from '../../types';
import { contextualize as frenPet } from './gameplay';

const children = { frenPet };

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const frenPetContextualizer = {
  contextualize,
  children,
};

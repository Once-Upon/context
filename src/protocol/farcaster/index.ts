import { Transaction } from '../../types';
import { contextualize as bundlerContextualizer } from './bundler';
import { contextualize as idGatewayContextualizer } from './idGateway';
import { contextualize as idRegistryContextualizer } from './idRegistry';
import { contextualize as storageRegistryContextualizer } from './storageRegistry';
import { contextualize as keyRegistryContextualizer } from './keyRegistry';
import { contextualize as keyGatewayContextualizer } from './keyGateway';

const children = {
  bundlerContextualizer,
  idGatewayContextualizer,
  idRegistryContextualizer,
  storageRegistryContextualizer,
  keyRegistryContextualizer,
  keyGatewayContextualizer,
};

const contextualize = (transaction: Transaction): Transaction => {
  for (const childContextualizer of Object.values(children)) {
    const result = childContextualizer(transaction);
    if (result.context?.summaries?.category) {
      return result;
    }
  }
};

export const farcasterContextualizer = {
  contextualize,
  children,
};

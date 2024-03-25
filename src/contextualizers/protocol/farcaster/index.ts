import { makeContextualize } from '../../../helpers/utils';
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

const contextualize = makeContextualize(children);

export const farcasterContextualizer = {
  contextualize,
  children,
};

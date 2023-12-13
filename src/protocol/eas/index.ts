import { makeContextualize } from '../../helpers/utils';
import { contextualize as _easContextualizer } from './eas';
import { contextualize as _schemaRegistryContextualizer } from './schemaRegistry';

const children = {
  _easContextualizer,
  _schemaRegistryContextualizer,
};

const contextualize = makeContextualize(children);

export const easContextualizer = {
  contextualize,
  children,
};

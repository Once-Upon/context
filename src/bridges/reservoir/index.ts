import { makeContextualize } from '../../helpers/utils';
import { contextualize as source } from './source';
import { contextualize as destination } from './destination';

const children = { source, destination };

const contextualize = makeContextualize(children);

export const reservoirContextualizer = {
  contextualize,
};

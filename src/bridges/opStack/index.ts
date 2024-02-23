import { makeContextualize } from '../../helpers/utils';
import { contextualize as source } from './source';

const children = { source };

const contextualize = makeContextualize(children);

export const optimismContextualizer = {
  contextualize,
};

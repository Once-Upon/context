import { makeContextualize } from '../../helpers/utils';
import { contextualize as optimism } from './optimism';

const children = { optimism };

const contextualize = makeContextualize(children);

export const optimismContextualizer = {
  contextualize,
};

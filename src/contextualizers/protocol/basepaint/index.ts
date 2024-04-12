import { makeContextualize } from '../../../helpers/utils';
import { contextualize as _basepaintContextualizer } from './basepaint';

const children = {
  _basepaintContextualizer,
};

const contextualize = makeContextualize(children);

export const basepaintContextualizer = {
  contextualize,
  children,
};

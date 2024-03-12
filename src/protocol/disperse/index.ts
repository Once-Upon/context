import { contextualize as disperse } from './disperse';
import { makeContextualize } from '../../helpers/utils';

const children = { disperse };

const contextualize = makeContextualize(children);

export const disperseContextualizer = {
  contextualize,
  children,
};

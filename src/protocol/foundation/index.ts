import { contextualize as foundation } from './foundation';
import { makeContextualize } from '../../helpers/utils';

const children = { foundation };

const contextualize = makeContextualize(children);

export const ensContextualizer = {
  contextualize,
  children,
};

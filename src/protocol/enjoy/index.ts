import { contextualize as enjoy } from './addLiquidity';
import { makeContextualize } from '../../helpers/utils';

const children = { enjoy };

const contextualize = makeContextualize(children);

export const enjoyContextualizer = {
  contextualize,
  children,
};

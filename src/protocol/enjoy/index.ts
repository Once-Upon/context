import { contextualize as enjoy } from './enjoy';
import { makeContextualize } from '../../helpers/utils';

const children = { enjoy };

const contextualize = makeContextualize(children);

export const enjoyContextualizer = {
  contextualize,
  children,
};

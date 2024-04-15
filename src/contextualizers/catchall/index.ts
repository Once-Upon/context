import { makeContextualize } from '../../helpers/utils';
import { contextualize as catchall } from './catchall';

const children = {
  catchall,
};

const contextualize = makeContextualize(children);

export const catchallContextualizer = {
  contextualize,
  children,
};

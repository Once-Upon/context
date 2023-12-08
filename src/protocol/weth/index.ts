import { makeContextualize } from '../../helpers/utils';
import { contextualize as weth } from './weth';

const children = { weth };

const contextualize = makeContextualize(children);

export const wethContextualizer = {
  contextualize,
  children,
};

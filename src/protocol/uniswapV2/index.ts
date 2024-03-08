import { contextualize as uniswapV2 } from './uniswapV2';
import { makeContextualize } from '../../helpers/utils';

const children = { uniswapV2 };

const contextualize = makeContextualize(children);

export const uniswapV2Contextualizer = {
  contextualize,
  children,
};

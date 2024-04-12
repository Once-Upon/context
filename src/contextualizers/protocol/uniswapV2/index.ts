import { contextualize as uniswapV2Router } from './uniswapV2Router';
import { makeContextualize } from '../../../helpers/utils';

const children = { uniswapV2Router };

const contextualize = makeContextualize(children);

export const uniswapV2Contextualizer = {
  contextualize,
  children,
};

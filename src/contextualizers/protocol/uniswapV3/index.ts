import { contextualize as uniswapV2Router } from './uniswapV3Router';
import { makeContextualize } from '../../../helpers/utils';

const children = { uniswapV2Router };

const contextualize = makeContextualize(children);

export const uniswapV2Contextualizer = {
  contextualize,
  children,
};

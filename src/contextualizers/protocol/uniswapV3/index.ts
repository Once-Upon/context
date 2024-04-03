import { contextualize as uniswapV3Pair } from './uniswapV3Pair';
import { makeContextualize } from '../../../helpers/utils';

const children = { uniswapV3Pair };

const contextualize = makeContextualize(children);

export const uniswapV2Contextualizer = {
  contextualize,
  children,
};

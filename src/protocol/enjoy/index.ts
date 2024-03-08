import { contextualize as addLiquidity } from './addLiquidity';
import { contextualize as claimTokens } from './claimTokens';
import { makeContextualize } from '../../helpers/utils';

const children = { addLiquidity, claimTokens };

const contextualize = makeContextualize(children);

export const enjoyContextualizer = {
  contextualize,
  children,
};

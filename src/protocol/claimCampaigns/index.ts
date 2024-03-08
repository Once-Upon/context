import { contextualize as claimTokens } from '../claimCampaigns/claimTokens';
import { makeContextualize } from '../../helpers/utils';

const children = { claimTokens };

const contextualize = makeContextualize(children);

export const uniswapV2Contextualizer = {
  contextualize,
  children,
};

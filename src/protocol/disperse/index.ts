import { contextualize as claimTokens } from '../claimCampaigns/claimTokens';
import { makeContextualize } from '../../helpers/utils';

const children = { claimTokens };

const contextualize = makeContextualize(children);

export const claimCampaignsContextualizer = {
  contextualize,
  children,
};

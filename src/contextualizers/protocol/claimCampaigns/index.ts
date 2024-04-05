import { contextualize as claimTokens } from './claimTokens';
import { makeContextualize } from '../../../helpers/utils';

const children = { claimTokens };

const contextualize = makeContextualize(children);

export const claimCampaignsContextualizer = {
  contextualize,
  children,
};

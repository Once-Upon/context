import { makeContextualize } from '../../helpers/utils';
import { wethContextualizer } from './weth';
import { ensContextualizer } from './ens';
import { easContextualizer } from './eas';
import { superchainFaucetContextualizer } from './superchainFaucet';
import { farcasterContextualizer } from './farcaster';
import { leeroyContextualizer } from './leeroy';
import { frenPetContextualizer } from './frenpet';
import { cryptopunksContextualizer } from './cryptopunks';
import { friendTechContextualizer } from './friendTech';
import { nounsContextualizer } from './nouns';
import { nounsBuilderContextualizer } from './nounsBuilder';
import { uniswapV2Contextualizer } from './uniswapV2';
import { claimCampaignsContextualizer } from './claimCampaigns';
import { basepaintContextualizer } from './basepaint';
import { disperseContextualizer } from './disperse';
import { zoraCreatorContextualizer } from './zoraCreator';
import { bnsContextualizer } from './bns';

const children = {
  wethContextualizer,
  ensContextualizer,
  easContextualizer,
  superchainFaucetContextualizer,
  farcasterContextualizer,
  leeroyContextualizer,
  frenPetContextualizer,
  cryptopunksContextualizer,
  friendTechContextualizer,
  nounsContextualizer,
  nounsBuilderContextualizer,
  uniswapV2Contextualizer,
  claimCampaignsContextualizer,
  basepaintContextualizer,
  disperseContextualizer,
  zoraCreatorContextualizer,
  bnsContextualizer,
};

const protocolContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(protocolContextualizers);

export const protocolContextualizer = {
  contextualize,
  children,
};

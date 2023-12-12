import { makeContextualize } from '../helpers/utils';
import { wethContextualizer } from './weth';
import { ensContextualizer } from './ens';
import { superchainFaucetContextualizer } from './superchainFaucet';
import { farcasterContextualizer } from './farcaster';
import { leeroyContextualizer } from './leeroy';
import { frenPetContextualizer } from './frenpet';

const children = {
  wethContextualizer,
  ensContextualizer,
  superchainFaucetContextualizer,
  farcasterContextualizer,
  leeroyContextualizer,
  frenPetContextualizer,
};

const heuristicContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(heuristicContextualizers);

export const protocolContextualizer = {
  contextualize,
  children,
};

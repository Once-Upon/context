import { makeContextualize } from '../helpers/utils';
import { protocolContextualizer } from './protocol';
import { heuristicContextualizer } from './heuristics';
import { bridgeContextualizer } from './bridges';
import { contextualize as catchallContextualizer } from './catchall/catchall';

const children = {
  protocolContextualizer: protocolContextualizer.contextualize,
  heuristicContextualizer: heuristicContextualizer.contextualize,
  bridgeContextualizer: bridgeContextualizer.contextualize,
  catchallContextualizer,
};

const contextualize = makeContextualize(children);

export const contextualizer = {
  contextualize,
  children,
};

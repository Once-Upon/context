import { makeContextualize } from '../helpers/utils';
import { optimismContextualizer } from './opStack';
import { reservoirContextualizer } from './reservoir';

const children = {
  optimismContextualizer,
  reservoirContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

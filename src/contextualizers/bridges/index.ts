import { makeContextualize } from '../../helpers/utils';
import { optimismContextualizer } from './opStack';
import { reservoirContextualizer } from './reservoir';
import { degenContextualizer } from './degen';

const children = {
  optimismContextualizer,
  reservoirContextualizer,
  degenContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

import { makeContextualize } from '../../helpers/utils';
import { optimismContextualizer } from './opStack';
import { reservoirContextualizer } from './reservoir';
import { acrossProtocolContextualizer } from './acrossProtocol';

const children = {
  optimismContextualizer,
  reservoirContextualizer,
  acrossProtocolContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

import { makeContextualize } from '../../helpers/utils';
import { optimismContextualizer } from './opStack';
import { reservoirContextualizer } from './reservoir';
import { acrossProtocolContextualizer } from './acrossProtocol';
import { starGateContextualizer } from './starGate';

const children = {
  optimismContextualizer,
  reservoirContextualizer,
  acrossProtocolContextualizer,
  starGateContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

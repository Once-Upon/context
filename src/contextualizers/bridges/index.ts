import { makeContextualize } from '../../helpers/utils';
import { optimismContextualizer } from './opStack';
import { reservoirContextualizer } from './reservoir';
import { degenContextualizer } from './degen';
import { acrossProtocolContextualizer } from './acrossProtocol';
import { starGateContextualizer } from './starGate';
import { hopTransferToL1Contextualizer } from './hopTransferToL1';
import { hopTransferToL2Contextualizer } from './hopTransferToL2';

const children = {
  optimismContextualizer,
  reservoirContextualizer,
  degenContextualizer,
  acrossProtocolContextualizer,
  starGateContextualizer,
  hopTransferToL1Contextualizer,
  hopTransferToL2Contextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

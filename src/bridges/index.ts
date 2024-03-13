import { makeContextualize } from '../helpers/utils';
import { optimismContextualizer } from './opStack';
import { zoraContextualizer } from './zora';

const children = {
  optimismContextualizer,
  zoraContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

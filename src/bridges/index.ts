import { makeContextualize } from '../helpers/utils';
import { optimismContextualizer } from './opStack';

const children = {
  optimismContextualizer,
};

const bridgeContextualizers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].contextualize]),
);

const contextualize = makeContextualize(bridgeContextualizers);

export const bridgeContextualizer = {
  contextualize,
  children,
};

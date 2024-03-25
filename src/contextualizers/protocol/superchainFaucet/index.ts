import { makeContextualize } from '../../../helpers/utils';
import { contextualize as superchainFaucet } from './superchainFaucet';

const children = { superchainFaucet };

const contextualize = makeContextualize(children);

export const superchainFaucetContextualizer = {
  contextualize,
};

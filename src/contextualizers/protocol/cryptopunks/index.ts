import { contextualize as cryptopunks } from './cryptopunks';
import { makeContextualize } from '../../../helpers/utils';

const children = { cryptopunks };

const contextualize = makeContextualize(children);

export const cryptopunksContextualizer = {
  contextualize,
  children,
};

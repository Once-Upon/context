import { makeContextualize } from '../../../helpers/utils';
import { contextualize as leeroy } from './leeroy';

const children = { leeroy };

const contextualize = makeContextualize(children);

export const leeroyContextualizer = {
  contextualize,
};

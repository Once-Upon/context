import { contextualize as ensRegistrar } from './registrar';
import { contextualize as ensReverse } from './reverse';
import { makeContextualize } from '../../../helpers/utils';

const children = { ensRegistrar, ensReverse };

const contextualize = makeContextualize(children);

export const ensContextualizer = {
  contextualize,
  children,
};

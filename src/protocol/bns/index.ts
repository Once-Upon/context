import { contextualize as bnsRegistrar } from './registrar';
import { contextualize as bnsResolver } from './resolver';
import { contextualize as bnsWrapper } from './wrapper';
import { contextualize as bnsReverse } from './reverse';
import { makeContextualize } from '../../helpers/utils';

const children = { bnsRegistrar, bnsResolver, bnsWrapper, bnsReverse};

const contextualize = makeContextualize(children);

export const bnsContextualizer = {
  contextualize,
  children,
};

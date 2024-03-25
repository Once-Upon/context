import { contextualize as auction } from './auction';
import { contextualize as governor } from './governor';
import { makeContextualize } from '../../../helpers/utils';

const children = { auction, governor };

const contextualize = makeContextualize(children);

export const nounsBuilderContextualizer = {
  contextualize,
  children,
};

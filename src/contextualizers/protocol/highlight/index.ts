import { contextualize as highlight } from './highlight';
import { makeContextualize } from '../../../helpers/utils';

const children = { highlight };

const contextualize = makeContextualize(children);

export const highlightContextualizer = {
  contextualize,
  children,
};

import { contextualize as zora } from './highlight';
import { makeContextualize } from '../../../helpers/utils';

const children = { zora };

const contextualize = makeContextualize(children);

export const zoraCreatorContextualizer = {
  contextualize,
  children,
};

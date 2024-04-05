import { contextualize as zora } from './zoraCreator';
import { makeContextualize } from '../../../helpers/utils';

const children = { zora };

const contextualize = makeContextualize(children);

export const zoraCreatorContextualizer = {
  contextualize,
  children,
};

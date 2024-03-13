import { contextualize as disperse } from './zoraCreator';
import { makeContextualize } from '../../helpers/utils';

const children = { disperse };

const contextualize = makeContextualize(children);

export const zoraCreatorContextualizer = {
  contextualize,
  children,
};

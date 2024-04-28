import { contextualize as boombox } from './boombox';
import { makeContextualize } from '../../../helpers/utils';

const children = { boombox };

const contextualize = makeContextualize(children);

export const boomboxContextualizer = {
  contextualize,
  children,
};

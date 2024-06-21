import { contextualize as rodeo } from './rodeo';
import { makeContextualize } from '../../../helpers/utils';

const children = { rodeo };

const contextualize = makeContextualize(children);

export const rodeoContextualizer = {
  contextualize,
  children,
};

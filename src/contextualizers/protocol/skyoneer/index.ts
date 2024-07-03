import { makeContextualize } from '../../../helpers/utils';
import { contextualize as source } from './source';
import { contextualize as destination } from './destination';
import { contextualize as plotAction } from './plotAction';

const children = { source, destination, plotAction };

const contextualize = makeContextualize(children);

export const skyoneerContextualizer = {
  contextualize,
};

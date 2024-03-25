import { contextualize as friendTech } from './friendTech';
import { makeContextualize } from '../../../helpers/utils';

const children = { friendTech };

const contextualize = makeContextualize(children);

export const friendTechContextualizer = {
  contextualize,
  children,
};

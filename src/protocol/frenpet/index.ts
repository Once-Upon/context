import { makeContextualize } from '../../helpers/utils';
import { contextualize as frenPet } from './gameplay';

const children = { frenPet };

const contextualize = makeContextualize(children);

export const frenPetContextualizer = {
  contextualize,
  children,
};

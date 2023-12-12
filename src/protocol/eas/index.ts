import { makeContextualize } from '../../helpers/utils';
import { contextualize as _easContextualizer } from "./eas";

const children = {
  _easContextualizer,
};

const contextualize = makeContextualize(children);

export const easContextualizer = {
  contextualize,
  children,
};

import { contextualize as warpcast } from './warpcast';
import { contextualize as mintWithWarps } from './mintWithWarps';
import { makeContextualize } from '../../../helpers/utils';

const children = { warpcast, mintWithWarps };

const contextualize = makeContextualize(children);

export const warpcastContextualizer = {
  contextualize,
  children,
};

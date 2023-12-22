import { contextualize as nounsAuctionHouse } from './nounsAuctionHouse';
import { makeContextualize } from '../../helpers/utils';

const children = { nounsAuctionHouse };

const contextualize = makeContextualize(children);

export const ensContextualizer = {
  contextualize,
  children,
};

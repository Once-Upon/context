import { contextualize as auctionHouse } from './nounsAuctionHouse';
import { contextualize as daoLogic } from './daoLogic';
import { makeContextualize } from '../../helpers/utils';

const children = { auctionHouse, daoLogic };

const contextualize = makeContextualize(children);

export const ensContextualizer = {
  contextualize,
  children,
};

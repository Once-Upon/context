import { contextualize as auctionHouse } from './auctionHouse';
import { contextualize as daoLogic } from './daoLogic';
import { makeContextualize } from '../../helpers/utils';

const children = { auctionHouse, daoLogic };

const contextualize = makeContextualize(children);

export const nounsContextualizer = {
  contextualize,
  children,
};

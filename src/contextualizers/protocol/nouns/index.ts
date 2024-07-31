import { contextualize as auctionHouse } from './auctionHouse';
import { contextualize as daoLogic } from './daoLogic';
import { contextualize as daoData } from './daoData';
import { makeContextualize } from '../../../helpers/utils';

const children = { auctionHouse, daoLogic, daoData };

const contextualize = makeContextualize(children);

export const nounsContextualizer = {
  contextualize,
  children,
};

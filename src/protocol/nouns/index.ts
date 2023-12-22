import { contextualize as nounsAuctionHouse } from './nounsAuctionHouse';
import { contextualize as nounsBuilderAuction } from './nounsBuilderAuction';
import { makeContextualize } from '../../helpers/utils';

const children = { nounsAuctionHouse, nounsBuilderAuction };

const contextualize = makeContextualize(children);

export const ensContextualizer = {
  contextualize,
  children,
};

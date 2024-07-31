import NounsAuctionHouseV2 from './abis/NounsAuctionHouseV2';
import NounsDAOLogicV4 from './abis/NounsDAOLogicV4';
import NounsDAOData from './abis/NounsDAOData';

export const NounsContracts = {
  AuctionHouse: '0x830bd73e4184cef73443c15111a1df14e495c706',
  NFT: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
  DAOLogic: '0x6f3e6272a167e8accb32072d08e0957f9c79223d',
  DAOData: '0xf790a5f59678dd733fb3de93493a91f472ca1365',
};

export const ABIs = {
  NounsAuctionHouse: NounsAuctionHouseV2,
  NounsDAOLogic: NounsDAOLogicV4,
  NounsDAOData: NounsDAOData,
};

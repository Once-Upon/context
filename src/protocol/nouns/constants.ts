import NounsAuctionHouse from './abis/NounsAuctionHouse';
import IAuction from './abis/IAuction';
import IGovernor from './abis/IGovernor';

export const NounsContracts = {
  AuctionHouse: '0x830bd73e4184cef73443c15111a1df14e495c706',
  NFT: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
};

// Mappings between Auction and ERC721 contracts for known NounsBuilder DAO instances
export const NounsBuilderDAOMappings = {
  '0x43790fe6bd46b210eb27f01306c1d3546aeb8c1b':
    '0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60', // Purple
  '0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d':
    '0xdf9b7d26c8fc806b1ae6273684556761ff02d422', // Builder
  '0xf4e5889919d6d8b78354e3671d8b96ffd1708e52':
    '0x351ea1a718521f22718ae14f7d380ae345fad043', // BLVKHVND
};

export const ABIs = {
  NounsAuctionHouse,
  IAuction,
  IGovernor,
};

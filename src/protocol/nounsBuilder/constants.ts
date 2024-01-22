import IAuction from './abis/IAuction';
import IGovernor from './abis/IGovernor';
import { mainnet } from 'viem/chains';
import { Chain } from 'viem';

export interface NounsBuilderInstance {
  name: string;
  auctionHouse: `0x${string}`;
  nft: `0x${string}`;
  governor: `0x${string}`;
  chain: Chain & { networkName: string };
}

const ethereum = { ...mainnet, networkName: "ethereum" };

export const NOUNS_BUILDER_INSTANCES: NounsBuilderInstance[] = [
  {
    name: 'Purple',
    auctionHouse: '0x43790fe6bd46b210eb27f01306c1d3546aeb8c1b',
    nft: '0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60',
    governor: '0xfb4a96541e1c70fc85ee512420eb0b05c542df57',
    chain: ethereum,
  },
  {
    name: 'Builder',
    auctionHouse: '0x658d3a1b6dabcfbaa8b75cc182bf33efefdc200d',
    nft: '0xdf9b7d26c8fc806b1ae6273684556761ff02d422',
    governor: '0xe3f8d5488c69d18abda42fca10c177d7c19e8b1a',
    chain: ethereum,
  },
  {
    name: 'BLVKHVND',
    auctionHouse: '0xf4e5889919d6d8b78354e3671d8b96ffd1708e52',
    nft: '0x351ea1a718521f22718ae14f7d380ae345fad043',
    governor: '0xa54ce3c884c68c01596853b25a3208acefda540e',
    chain: ethereum,
  },
];

export const ABIs = {
  IAuction,
  IGovernor,
};

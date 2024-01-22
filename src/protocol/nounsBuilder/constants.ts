import IAuction from './abis/IAuction';
import IGovernor from './abis/IGovernor';
import { mainnet, zora as _zora, base as _base } from 'viem/chains';
import { Chain } from 'viem';

export interface NounsBuilderInstance {
  name: string;
  auctionHouse: `0x${string}`;
  nft: `0x${string}`;
  governor: `0x${string}`;
  chain: Chain & { networkName: string };
}

const ethereum = { ...mainnet, networkName: 'ethereum' };
const zora = { ..._zora, networkName: 'zora' };
const base = { ..._base, networkName: 'base' };

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
  {
    name: 'ENERGY',
    auctionHouse: '0x94eed78a8e3e862d195cdde333a2201f6517ad97',
    nft: '0x32297b7416294b1acf404b6148a3c58107ba8afd',
    governor: '0xdcd8ad7f4904d4ed9c1f1e38e18ab9646b897121',
    chain: zora,
  },
  {
    name: 'Collective Nouns',
    auctionHouse: '0x0aa23a7e112889c965010558803813710becf263',
    nft: '0x220e41499cf4d93a3629a5509410cbf9e6e0b109',
    governor: '0x1297ffd714acb55af447c6b7641b3cf01930d605',
    chain: base,
  },
];

export const ABIs = {
  IAuction,
  IGovernor,
};

import { InterfaceAbi } from '../types/Abi';

export const TOKEN_SWAP_CONTRACTS = [
  '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap V3 Router
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // Uniswap V3router2
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2 Router2
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b', // Uniswap Universal Router1
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad', // Uniswap Universal Router2
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f', // Sushiswap Router
  '0x1111111254fb6c44bac0bed2854e76f90643097d', // 1inch Router
  '0x881d40237659c251811cec9c364ef91dc08d300c', // Metamask Swap Router
  '0xe66b31678d6c16e9ebf358268a790b763c133750', // Coinbase Wallet Swapper
  '0x00000000009726632680fb29d3f7a9734e3010e2', // Rainbow Router
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Exchange Proxy. NOTE - This is both an erc20 swap and erc721 swap contract. This address is in both contract lists.
];

export const AIRDROP_THRESHOLD = 10;

export const KNOWN_ADDRESSES = {
  NULL: '0x0000000000000000000000000000000000000000',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
};

export const WETH_ADDRESSES = [
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // Ethereum
  '0x4200000000000000000000000000000000000006', // Optimism
  '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f', // Linea
  '0x0000000000a39bb272e79075ade125fd351887ac', // Blur
];
export const WETH_ABI: InterfaceAbi = [
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'wad',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

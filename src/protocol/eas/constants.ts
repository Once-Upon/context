import EAS from './abis/EAS.json';
import SchemaRegistry from './abis/SchemaRegistry.json';

export const EAS_ADDRESSES = [
  '0xa1207f3bba224e2c9c3c6d5af63d0eb1582ce587', // Ethereum
  '0x4200000000000000000000000000000000000021', // OP Stack
  '0xaef4103a04090071165f78d45d83a0c0782c2b2a', // Linea
  '0xc47300428b6ad2c7d03bb76d05a176058b47e6b0', // Scroll
];

export const SCHEMA_REGISTRY_ADDRESSES = [
  '0xa7b39296258348c78294f95b872b282326a97bdf', // Ethereum
  '0x4200000000000000000000000000000000000020', // OP Stack
  '0x55d26f9ae0203ef95494ae4c170ed35f4cf77797', // Linea
  '0xd2cdf46556543316e7d34e8edc4624e2bb95e3b6', // Scroll
];

export const EAS_LINKS = {
  1: 'https://easscan.org/schema/view',
  10: 'https://optimism.easscan.org/schema/view',
  8453: 'https://base.easscan.org/schema/view',
  // TODO: Add the Goerli and Sepolia links
};

export const ABIs = {
  EAS,
  SchemaRegistry,
};

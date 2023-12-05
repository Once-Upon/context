import { utils, ContractInterface } from 'ethers';

export type InterfaceAbi = Exclude<ContractInterface, utils.Interface>;

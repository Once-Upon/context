import {
  AssetTransfer,
  NetAssetTransfers,
  PartialTransaction,
  PseudoTransaction,
  RawBlock,
} from 'src/types';
import { makeTransform } from '../helpers/utils';
import * as pseudoTransactionsFromUserOps from './_common/accountAbstraction';
import * as transactionAssetTransfers from './_common/assetTransfers';
import * as transactionDelegateCalls from './_common/delegateCalls';
import * as transactionDerivativesNeighbors from './_common/derivativesNeighbors';
import * as transactionErrors from './_common/errors';
import * as transactionNetAssetTransfers from './_common/netAssetTransfers';
import * as transactionParties from './_common/parties';
import * as transactionSigHash from './_common/sigHash';
import * as transactionTimestamp from './_common/timestamp';
import * as transactionAssetTransfersOldNFTs from './ethereum/assetTransfersOldNFTs';
import * as transactionAssetTransfersCryptopunks from './ethereum/assetTransfersCryptopunks';
import * as transactionFees from './ethereum/fees';
import * as transactionForks from './ethereum/forks';

const children = {
  pseudoTransactionsFromUserOps,
  transactionAssetTransfers,
  transactionAssetTransfersOldNFTs,
  transactionAssetTransfersCryptopunks,
  transactionDelegateCalls,
  transactionDerivativesNeighbors,
  transactionErrors,
  transactionNetAssetTransfers,
  transactionParties,
  transactionSigHash,
  transactionTimestamp,
  transactionFees,
  transactionForks,
};

const utils: Utils = {
  extractNetAssetTransfers:
    transactionNetAssetTransfers.extractNetAssetTransfers,
  unpackERC4337Transactions:
    pseudoTransactionsFromUserOps.unpackERC4337Transactions,
};

const transformers = Object.fromEntries(
  Object.entries(children).map(([key, { transform }]) => [key, transform]),
);

const transform = makeTransform(transformers);

type Utils = {
  extractNetAssetTransfers: (
    assetTransfers: AssetTransfer[],
  ) => NetAssetTransfers;
  unpackERC4337Transactions: (
    transaction: PartialTransaction,
  ) => PseudoTransaction[];
};

type UsabilityTransformer = {
  transform: (block: RawBlock) => RawBlock;
  children: Record<string, unknown>;
  utils: Utils;
};

export const transformer: UsabilityTransformer = {
  transform,
  children,
  utils,
};

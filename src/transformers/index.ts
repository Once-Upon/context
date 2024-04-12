import { AssetTransfer, NetAssetTransfers, RawBlock } from 'src/types';
import { makeTransform } from '../helpers/utils';
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

const utils = {
  extractNetAssetTransfers:
    transactionNetAssetTransfers.extractNetAssetTransfers,
};

const transformers = Object.fromEntries(
  Object.keys(children).map((key) => [key, children[key].transform]),
);

const transform = makeTransform(transformers);

type UsabilityTransformer = {
  transform: (block: RawBlock) => RawBlock;
  children: Record<string, unknown>;
  utils: {
    extractNetAssetTransfers: (
      assetTransfers: AssetTransfer[],
    ) => NetAssetTransfers;
  };
};

export const transformer: UsabilityTransformer = {
  transform,
  children,
  utils,
};

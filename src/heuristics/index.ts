import { makeContextualize } from '../helpers/utils';
import { cancelPendingTransactionContextualizer } from './cancelPendingTransaction';
import { contractDeploymentContextualizer } from './contractDeployment';
import { erc20SwapContextualizer } from './erc20Swap';
import { erc721PurchaseContextualizer } from './erc721Purchase';
import { erc1155PurchaseContextualizer } from './erc1155Purchase';
import { ethTransferContextualizer } from './ethTransfer';
import { idmContextualizer } from './idm';
import { tokenAirdropContextualizer } from './tokenAirdrop';
import { tokenApprovalContextualizer } from './tokenApproval';
import { tokenMintContextualizer } from './tokenMint';
import { tokenTransferContextualizer } from './tokenTransfer';
import { erc721SaleContextualizer } from './erc721Sale';
import { erc1155SaleContextualizer } from './erc1155Sale';

const children = {
  cancelPendingTransactionContextualizer,
  contractDeploymentContextualizer,
  erc20SwapContextualizer,
  erc721PurchaseContextualizer,
  erc1155PurchaseContextualizer,
  ethTransferContextualizer,
  idmContextualizer,
  tokenAirdropContextualizer,
  tokenApprovalContextualizer,
  tokenMintContextualizer,
  tokenTransferContextualizer,
  erc721SaleContextualizer,
  erc1155SaleContextualizer,
};

const contextualize = makeContextualize(children);

export const heuristicContextualizer = {
  contextualize,
  children,
};

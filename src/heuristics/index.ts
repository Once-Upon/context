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
import { erc20MintContextualizer } from './erc20Mint';
import { erc721MintContextualizer } from './erc721Mint';
import { erc1155MintContextualizer } from './erc1155Mint';
import { tokenTransferContextualizer } from './tokenTransfer';

const children = {
  cancelPendingTransactionContextualizer,
  contractDeploymentContextualizer,
  erc20MintContextualizer,
  erc721MintContextualizer,
  erc1155MintContextualizer,
  erc20SwapContextualizer,
  erc721PurchaseContextualizer,
  erc1155PurchaseContextualizer,
  ethTransferContextualizer,
  idmContextualizer,
  tokenAirdropContextualizer,
  tokenApprovalContextualizer,
  tokenTransferContextualizer,
};

const contextualize = makeContextualize(children);

export const heuristicContextualizer = {
  contextualize,
  children,
};

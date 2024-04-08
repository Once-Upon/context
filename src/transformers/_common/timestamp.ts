import { type TxnTransformer } from '../../helpers/utils';

export const transform: TxnTransformer = (block, tx) => {
  tx.timestamp = block.timestamp;
  return tx;
};

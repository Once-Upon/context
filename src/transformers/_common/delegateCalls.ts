import type { TxnTransformer } from '../../helpers/utils';

export const transform: TxnTransformer = (_block, tx) => {
  const delegateCalls = tx.traces.filter(
    (t) => t.action.callType === 'delegatecall',
  );
  tx.delegateCalls = delegateCalls;

  return tx;
};

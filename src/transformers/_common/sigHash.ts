import { isRawTransaction, type TxnTransformer } from '../../helpers/utils';
import type { InternalHashType } from '../../types';

export const transform: TxnTransformer = (_block, tx) => {
  if (!isRawTransaction(tx)) return tx;
  const sigHash = tx.input.slice(0, 10);
  const internalSigHashes: InternalHashType[] = tx.traces.map((trace) => ({
    from: trace.action.from,
    to: trace.action.to,
    sigHash: String(trace.action.input).slice(0, 10),
  }));

  tx.sigHash = sigHash;
  tx.internalSigHashes = internalSigHashes;

  return tx;
};

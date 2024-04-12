import type { RawBlock, InternalHashType } from '../../types';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const sigHash = tx.input.slice(0, 10);
    const internalSigHashes: InternalHashType[] = tx.traces.map((trace) => ({
      from: trace.action.from,
      to: trace.action.to,
      sigHash: String(trace.action.input).slice(0, 10),
    }));

    tx.sigHash = sigHash;
    tx.internalSigHashes = internalSigHashes;

    return tx;
  });

  return block;
}

import type { RawBlock } from '../../types';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const delegateCalls = tx.traces.filter(
      (t) => t.action.callType === 'delegatecall',
    );
    tx.delegateCalls = delegateCalls;

    return tx;
  });

  return block;
}

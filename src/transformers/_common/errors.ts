import type { RawBlock } from '../../types';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const errors: string[] = [];

    for (const trace of tx.traces) {
      if (trace.error) {
        errors.push(trace.error);
      }
    }

    tx.errors = errors;

    return tx;
  });

  return block;
}

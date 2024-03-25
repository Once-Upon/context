import type { RawBlock } from '../../types';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    tx.timestamp = block.timestamp;
    return tx;
  });

  return block;
}

import type { RawBlock } from '../../types';
import { FORKS } from '../../helpers/constants';

export function transform(block: RawBlock): RawBlock {
  for (const [forkName, forkNumber] of Object.entries(FORKS)) {
    if (block.number >= forkNumber) {
      block.fork = forkName;
    }
  }

  return block;
}

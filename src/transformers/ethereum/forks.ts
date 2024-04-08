import { type BlockTransformer } from '../../helpers/utils';
import { FORKS } from '../../helpers/constants';

export const transform: BlockTransformer = (block) => {
  for (const [forkName, forkNumber] of Object.entries(FORKS)) {
    if (block.number >= forkNumber) {
      block.fork = forkName;
    }
  }

  return block;
}

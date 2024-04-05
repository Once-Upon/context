import { RawBlock } from 'src/types';

import * as path from 'path';
import * as fs from 'fs';
import { normalizeBlock } from './utils';

// Get block number from filenames in ../blocks/{chain}
export function loadBlockFixture(
  chain: string,
  blockNumber: number | string,
): RawBlock {
  // first load the raw data and parse it as a RawBlock
  const raw = fs
    .readFileSync(
      path.join(
        __dirname,
        '..',
        'transformers',
        'test',
        'blocks',
        chain,
        `${blockNumber}.json`,
      ),
    )
    .toString();
  const rawBlock = JSON.parse(raw) as RawBlock;
  const block = normalizeBlock(rawBlock);
  return block;
}

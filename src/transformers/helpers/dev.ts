// TODO: Find a good way to dedupe this with the one in src/helpers/dev.ts

import { RawBlock, StdObj } from 'src/types';

import * as path from 'path';
import * as fs from 'fs';

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

// TODO: Find a good way to dedupe this with the one in src/helpers/utils
export const normalizeBlock = (block: StdObj): RawBlock => {
  // console.log('block', block);

  let str = JSON.stringify(block);

  // replace all EVM addresses with lowercased versions
  str = str.replace(/("0x[A-z0-9]{40}")/g, (v) => v.toLowerCase());

  return JSON.parse(str) as RawBlock;
};

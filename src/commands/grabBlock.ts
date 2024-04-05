import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';
import axios from 'axios';
import { program } from './main';
import { normalizeBlock } from 'src/helpers/utils';
import { RawBlock } from 'src/types';

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

export function registerGrabBlockCommand() {
  program
    .command('grab-block')
    .description('Grab a block from API and decode it')
    .argument('<blockNumber>', 'block number')
    .argument('<network>', 'network name')
    .action(async (blockNumber, network, options) => {
      const dirPath = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'transformers',
        'test',
        'blocks',
        network,
      );
      const txFilePath = path.join(dirPath, `${blockNumber}.json`);
      const gzFilePath = path.join(dirPath, `${blockNumber}.json.gz`);
      const decodedFilePath = path.join(dirPath, `${blockNumber}_decoded.json`);

      const storageUrl = `https://storage.googleapis.com/indexingco_heartbeats/${network}/${blockNumber}.json.gz`;
      const decodeUrl = `https://decode.onceupon.xyz`;

      try {
        console.log(
          `Fetching block from Google Storage: ${network}/${blockNumber}`,
        );
        const response = await axios({
          method: 'get',
          url: storageUrl,
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(gzFilePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        console.log(`Decompressing: ${gzFilePath}`);
        const decompressed = zlib.gunzipSync(fs.readFileSync(gzFilePath));
        fs.writeFileSync(txFilePath, decompressed);

        console.log(`Sending data to decode service`);
        const decodedData = await axios.post(decodeUrl, decompressed, {
          headers: { 'Content-Type': 'application/json' },
        });

        fs.writeFileSync(decodedFilePath, JSON.stringify(decodedData.data));
        console.log(`Decoded block saved to ${decodedFilePath}`);

        // Remove the gz file and the original json file after saving the decoded data
        fs.unlinkSync(gzFilePath);
        fs.unlinkSync(txFilePath);

        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Failed to grab and decode the block:', error);
        process.exit(1); // Exit with error
      }
    });
}

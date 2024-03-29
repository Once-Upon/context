import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';
import axios from 'axios';
import { program } from './main';

export function registerGrabBlockCommand() {
  program
    .command('grab-block')
    .description('Grab a block from API and decode it')
    .argument('<blockNumber>', 'block number')
    .argument('<network>', 'network name')
    .action(async (blockNumber, network, options) => {
      const srcDir = path.join(__dirname, '..', '..', 'src', 'transformers');
      const txFilePath = path.join(
        srcDir,
        'test',
        'blocks',
        network,
        `${blockNumber}.json`,
      );
      const gzFilePath = `${txFilePath}.gz`;
      const decodedFilePath = `${txFilePath}_decoded.json`;

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
        console.log(`Decoded transaction saved to ${decodedFilePath}`);
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Failed to grab and decode the transaction:', error);
        process.exit(1); // Exit with error
      }
    });
}

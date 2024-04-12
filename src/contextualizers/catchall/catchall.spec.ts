import { Transaction } from '../../types';
import { detect, generate } from './catchall';
import { contextSummary } from '../../helpers/utils';
import catchallZeroErc20s0x20f3ee91 from '../test/transactions/catchallZeroErc20s-0x20f3ee91.json';
import catchall0xac15f84b from '../test/transactions/catchall-0xac15f84b.json';
import catchallEth0xc0549c83 from '../test/transactions/catchall-eth-0xc0549c83.json';
import catchall0x982d9d88 from '../test/transactions/catchall-0x982d9d88.json';
import catchall0x26ca372d from '../test/transactions/catchall-0x26ca372d.json';
import catchall0x6331ce46 from '../test/transactions/catchall-0x6331ce46.json';
import catchall0xdfdb78fd from '../test/transactions/catchall-0xdfdb78fd.json';
import catchall0x80c1b6eb from '../test/transactions/catchall-0x80c1b6eb.json';

describe('catchall', () => {
  it('Should detect catchall transaction', () => {
    const catchallZeroErc20s = detect(
      catchallZeroErc20s0x20f3ee91 as unknown as Transaction,
    );
    expect(catchallZeroErc20s).toBe(true);
  });

  it('Should generate catchall context', () => {
    const txResult1 = generate(
      catchallZeroErc20s0x20f3ee91 as unknown as Transaction,
    );
    const variables1 = txResult1.context?.variables;
    expect(variables1?.totalERC20s).not.toBeDefined();
    // detect single erc20
    const txResult2 = generate(catchall0xac15f84b as unknown as Transaction);
    const variables2 = txResult2.context?.variables;
    expect(variables2?.totalERC20s).not.toBeDefined();
    const desc2 = contextSummary(txResult2.context);
    expect(desc2).toBe(
      '0x662127bf82b794a26b7ddb6b495f6a5a20b81738 INTERACTED_WITH 0x059686e72f1e970da96e335f02e49da3933fa0f6 and 500802548943424475655 0x5afe3855358e112b5647b952709e6165e1c1eeee was transferred from 0xa0b937d5c8e32a80e3a8ed4227cd020221544ee6 to 0x059686e72f1e970da96e335f02e49da3933fa0f6',
    );
    // detect eth
    const txResult3 = generate(catchallEth0xc0549c83 as unknown as Transaction);
    const variables3 = txResult3.context?.variables;
    expect(variables3?.totalEth['value']).toBe('15000000000000000');
    const desc3 = contextSummary(txResult3.context);
    expect(desc3).toBe(
      '0x15cce5a86dbec5bca10267f93043b3fe8c8e53bf INTERACTED_WITH 0x3154cf16ccdb4c6d922629664174b904d80f2c35 and 0.015 ETH was transferred',
    );
    // detect several erc20s
    const txResult4 = generate(catchall0x982d9d88 as unknown as Transaction);
    const variables4 = txResult4.context?.variables;
    expect(variables4?.totalERC20s['value']).toBe(3);
    const desc4 = contextSummary(txResult4.context);
    expect(desc4).toBe(
      '0x42be9b4b12a8021529a1440158c84f624c316d10 CALLED harvestPosition on 0x7c04bf2bb7d27982810e432b188fa0c7729e651d and 3 ERC20s were transferred',
    );
    // detect total eth
    const txResult5 = generate(catchall0x26ca372d as unknown as Transaction);
    const variables5 = txResult5.context?.variables;
    expect(variables5?.totalEth['value']).toBe('14559963185419400');
    const desc5 = contextSummary(txResult5.context);
    expect(desc5).toBe(
      '0x43375ce534ea8d3b6b8876186084044f03578826 INTERACTED_WITH 0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789 and 4 ERC20s and 0.0145599631854194 ETH were transferred',
    );
    // generate description correctly
    const txResult6 = generate(catchall0x6331ce46 as unknown as Transaction);
    const variables6 = txResult6.context?.variables;
    expect(variables6?.totalERC20s['value']).toBe(2);
    expect(variables6?.totalERC20s['unit']).toBe('ERC20s');
    const desc6 = contextSummary(txResult6.context);
    expect(desc6).toBe(
      '0x9d5a39938412ff6396843e53f1cfe2d96035f9c8 INTERACTED_WITH 0x82ac2ce43e33683c58be4cdc40975e73aa50f459 and 2 ERC20s were transferred',
    );

    const txResult7 = generate(catchall0xdfdb78fd as unknown as Transaction);
    const variables7 = txResult7.context?.variables;
    expect(variables7?.totalEth['value']).toBe('5000000000000000');
    expect(variables7?.totalNFTs['value']).toBe(1);
    expect(variables7?.totalNFTs['unit']).toBe('NFT');
    const desc7 = contextSummary(txResult7.context);
    expect(desc7).toBe(
      '0x38e35bff679b66f121ef2a658d42b50d6a37c0fb INTERACTED_WITH 0x13d8faf4a690f5ae52e2d2c52938d1167057b9af and 1 NFT and 0.005 ETH were transferred',
    );

    const txResult8 = generate(catchall0x80c1b6eb as unknown as Transaction);
    const variables8 = txResult8.context?.variables;
    expect(variables8?.totalEth['value']).toBe('7770000000000000');
    expect(variables8?.totalNFTs['value']).toBe(10);
    expect(variables8?.totalNFTs['unit']).toBe('NFTs');
    const desc8 = contextSummary(txResult8.context);
    expect(desc8).toBe(
      '0xf70da97812cb96acdf810712aa562db8dfa3dbef INTERACTED_WITH 0x524d8cf45f38f98d8b08950876d2147f8e20672e and 10 NFTs and 0.00777 ETH were transferred',
    );
  });
});

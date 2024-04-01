import { Transaction } from '../../types';
import { detect, generate } from './resolver';
import { contextSummary } from '../../helpers/utils';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import bnsSetAddr0x386f74ac from '../../test/transactions/bns-set-addr-0x386f74ac.json';
import bnsSetContentHash0xaadbb7bc from '../../test/transactions/bns-set-contenthash-0xaadbb7bc.json';
import bnsSetRecords0x6565bbb1 from '../../test/transactions/bns-set-records-0x6565bbb1.json';

describe('BNS Resolver', () => {
  it('Should not detect as bns resolver', () => {
    const bnsReverse = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(bnsReverse).toBe(false);
  });

  it('Should detect as bns resolver transaction', () => {
    const bns1 = detect(bnsSetAddr0x386f74ac as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should detect as bns resolver transaction', () => {
    const bns1 = detect(bnsSetContentHash0xaadbb7bc as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should detect as bns resolver transaction', () => {
    const bns1 = detect(bnsSetRecords0x6565bbb1 as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should generate bns context', () => {
    const bns1 = generate(bnsSetAddr0x386f74ac as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0x4fb3f133951bf1b2d52ff6ceab2c703fbb6e98cc UPDATED_ADDRESS',
    );
  });

  it('Should generate bns context', () => {
    const bns1 = generate(
      bnsSetContentHash0xaadbb7bc as unknown as Transaction,
    );
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0x7ee09931b82437940dbdc2ee30af3c333b3eb20c UPDATED_CONTENTHASH',
    );
  });

  it('Should generate bns context', () => {
    const bns1 = generate(bnsSetRecords0x6565bbb1 as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0x44a9b3a6427d16c1e71ad1ffb5330ff66fd35899 UPDATED_RECORDS',
    );
  });
});

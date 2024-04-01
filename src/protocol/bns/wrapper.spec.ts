import { Transaction } from '../../types';
import { detect, generate } from './wrapper';
import { contextSummary } from '../../helpers/utils';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import bnsTransfer0xe2b6affb from '../../test/transactions/bns-transfer-0xe2b6affb.json';
import bnsBatchTransfer0xac234a7b from '../../test/transactions/bns-batch-transfer-0xac234a7b.json';

describe('BNS Name Wrapper', () => {
  it('Should not detect as bns wrapper', () => {
    const bnsReverse = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(bnsReverse).toBe(false);
  });

  it('Should detect as bns wrapper transaction', () => {
    const bns1 = detect(bnsTransfer0xe2b6affb as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should detect as bns wrapper transaction', () => {
    const bns1 = detect(bnsBatchTransfer0xac234a7b as unknown as Transaction);
    expect(bns1).toBe(true);
  });

  it('Should generate bns wrapper context', () => {
    const bns1 = generate(bnsTransfer0xe2b6affb as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0x28864ed550625794f32ee4950da89d30af130754 TRANSFERED_NAME to 0x28864ed550625794f32eE4950dA89D30aF130754',
    );
  });

  it('Should generate bns wrapper context', () => {
    const bns1 = generate(bnsBatchTransfer0xac234a7b as unknown as Transaction);
    const desc1 = contextSummary(bns1.context);
    expect(desc1).toBe(
      '0x28864ed550625794f32ee4950da89d30af130754 TRANSFERED_NAMES to 0x28864ed550625794f32eE4950dA89D30aF130754',
    );
  });
});

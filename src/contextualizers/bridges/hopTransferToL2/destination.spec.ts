import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import hopTransferToL2Destination0xf7a3afa9 from '../../test/transactions/hopTransferToL2Destination-0xf7a3afa9.json';
import hopTransferToL2Destination0x4bdc41d8 from '../../test/transactions/hopTransferToL2Destination-0x4bdc41d8.json';

describe('HopTransferToL2 Destination', () => {
  it('Should detect transaction', () => {
    const isHopTransferToL21 = detect(
      hopTransferToL2Destination0xf7a3afa9 as unknown as Transaction,
    );
    expect(isHopTransferToL21).toBe(true);

    const isHopTransferToL22 = detect(
      hopTransferToL2Destination0x4bdc41d8 as unknown as Transaction,
    );
    expect(isHopTransferToL22).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      hopTransferToL2Destination0xf7a3afa9 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x36bde71c97b33cc4729cf772ae268934f7ab70b2 BRIDGED 0.003213520671386352 ETH from 1',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      hopTransferToL2Destination0x4bdc41d8 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x977f82a600a1414e583f7f13623f1ac5d58b1c0b BRIDGED 0.12 ETH from 1',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

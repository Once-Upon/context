import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import hopTransferToL1Destination0xf1bec046 from '../../test/transactions/hopTransferToL1Destination-0xf1bec046.json';
import hopTransferToL1Destination0xfcc3aac0 from '../../test/transactions/hopTransferToL1Destination-0xfcc3aac0.json';

describe('HopTransferToL1 Destination', () => {
  it('Should detect transaction', () => {
    const isHopTransferToL11 = detect(
      hopTransferToL1Destination0xf1bec046 as unknown as Transaction,
    );
    expect(isHopTransferToL11).toBe(true);

    const isHopTransferToL12 = detect(
      hopTransferToL1Destination0xfcc3aac0 as unknown as Transaction,
    );
    expect(isHopTransferToL12).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      hopTransferToL1Destination0xf1bec046 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x710bda329b2a6224e4b44833de30f38e7f81d564 BRIDGED 0.170931099195511801 ETH from 1',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      hopTransferToL1Destination0xfcc3aac0 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x710bda329b2a6224e4b44833de30f38e7f81d564 BRIDGED 0.006454929355621129 ETH from 1',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

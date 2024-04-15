import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import hopTransferToL2Source0x4f8b964b from '../../test/transactions/hopTransferToL2Source-0x4f8b964b.json';
import hopTransferToL2Source0x94658894 from '../../test/transactions/hopTransferToL2Source-0x94658894.json';

describe('HopTransferToL2 Source', () => {
  it('Should detect transaction', () => {
    const isHopTransferToL21 = detect(
      hopTransferToL2Source0x4f8b964b as unknown as Transaction,
    );
    expect(isHopTransferToL21).toBe(true);

    const isHopTransferToL22 = detect(
      hopTransferToL2Source0x94658894 as unknown as Transaction,
    );
    expect(isHopTransferToL22).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      hopTransferToL2Source0x4f8b964b as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x899e3faac572083227ae0831fd441438075f845e BRIDGED 0.003213520671386352 ETH to 10',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      hopTransferToL2Source0x94658894 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0xd5590c642aace5d9124639d263c1e2a8e406e899 BRIDGED 0.12 ETH to 8453',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

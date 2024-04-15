import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import hopTransferToL1Source0xa6bf9d58 from '../../test/transactions/hopTransferToL1Source-0xa6bf9d58.json';
import hopTransferToL1Source0x0a1629bb from '../../test/transactions/hopTransferToL1Source-0x0a1629bb.json';

describe('HopTransferToL1 Source', () => {
  it('Should detect transaction', () => {
    const isHopTransferToL11 = detect(
      hopTransferToL1Source0xa6bf9d58 as unknown as Transaction,
    );
    expect(isHopTransferToL11).toBe(true);

    const isHopTransferToL12 = detect(
      hopTransferToL1Source0x0a1629bb as unknown as Transaction,
    );
    expect(isHopTransferToL12).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      hopTransferToL1Source0xa6bf9d58 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x010d004994113122fe3d8c59398b8490f72016cf BRIDGED 3.195744355131508403 ETH to 1',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      hopTransferToL1Source0x0a1629bb as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x74b78e98093f5b522a7ebdac3b994641ca7c2b20 BRIDGED 0.150002074273594775 ETH to 1',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

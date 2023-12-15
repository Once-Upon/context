import { Transaction } from '../../types';
import { detect, generate } from './cancelPendingTransaction';
import cancelPendingTransaction0x62bf9724 from '../../test/transactions/cancelPendingTransaction-0x62bf9724.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../helpers/utils';

describe('Cancel Pending Transaction', () => {
  it('Should detect CancelPendingTransaction', () => {
    const cancelPendingTransaction1 = detect(
      cancelPendingTransaction0x62bf9724 as Transaction,
    );
    expect(cancelPendingTransaction1).toBe(true);
  });

  it('Should generate context for CancelPendingTransaction', () => {
    const cancelPendingTransaction1 = generate(
      cancelPendingTransaction0x62bf9724 as Transaction,
    );
    expect(cancelPendingTransaction1.context.summaries.en.title).toBe(
      'cancelPendingTransaction',
    );
    const desc = contextSummary(cancelPendingTransaction1.context);
    expect(desc).toBe(
      '0xc0899a4f231f69a8c97011820cd8ebd2e3611d52 CANCELED_A_PENDING_TRANSACTION with nonce 386',
    );
  });

  it('Should not detect as CancelPendingTransaction', () => {
    const notContractDeployed1 = detect(catchall0xc35c01ac as Transaction);
    expect(notContractDeployed1).toBe(false);
  });
});

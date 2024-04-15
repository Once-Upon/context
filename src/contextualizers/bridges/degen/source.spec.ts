import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import degenBaseSource0xafc5380e from '../../test/transactions/degenBaseSource-0xafc5380e.json';

describe('Degen Bridge Source', () => {
  it('Should detect transaction', () => {
    const isDegenBridgeSource1 = detect(
      degenBaseSource0xafc5380e as unknown as Transaction,
    );
    expect(isDegenBridgeSource1).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      degenBaseSource0xafc5380e as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x729170d38dd5449604f35f349fdfcc9ad08257cd INITIATED_A_CROSS_CHAIN_INTERACTION via 0x43019f8be1f192587883b67dea2994999f5a2de2',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);
  });
});

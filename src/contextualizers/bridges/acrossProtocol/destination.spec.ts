import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary } from '../../../helpers/utils';
import acrossProtocolBaseEth0xfc9a2f83 from '../../test/transactions/across-protocol-base-eth-0xfc9a2f83.json';

describe('Across Protocol Destination', () => {
  it('Should detect transaction', () => {
    const isAcrossProtocolDestination1 = detect(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(isAcrossProtocolDestination1).toBe(true);
  });

  it('Should generate context', () => {
    const transaction = generate(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(transaction.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction.context)).toBe(
      '0x661ea32f349f857075cae289e7f6222c2ad083b9 BRIDGED 0.1 ETH from 1',
    );
  });
});

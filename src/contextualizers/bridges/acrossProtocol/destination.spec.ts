import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import acrossProtocolDestination0x8c31b118 from '../../test/transactions/acrossProtocolDestination-0x8c31b118.json';
import acrossProtocolDestination0xdc572089 from '../../test/transactions/acrossProtocolDestination-0xdc572089.json';

describe('Across Protocol Destination', () => {
  it('Should detect transaction', () => {
    const isAcrossProtocolDestination1 = detect(
      acrossProtocolDestination0x8c31b118 as unknown as Transaction,
    );
    expect(isAcrossProtocolDestination1).toBe(true);

    const isAcrossProtocolDestination2 = detect(
      acrossProtocolDestination0xdc572089 as unknown as Transaction,
    );
    expect(isAcrossProtocolDestination2).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      acrossProtocolDestination0x8c31b118 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0x29934a66350b35e3fa39826007c54a01c7bc639a BRIDGED 0.000000000203404533 ETH from 324',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      acrossProtocolDestination0xdc572089 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x15652636f3898f550b257b89926d5566821c32e1 BRIDGED 0.00000000202589206 ETH from 137',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

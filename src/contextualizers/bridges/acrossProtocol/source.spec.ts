import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import acrossProtocolBaseEth0xfc9a2f83 from '../../test/transactions/across-protocol-base-eth-0xfc9a2f83.json';
import acrossProtocolBaseOpt0xe1cb6100 from '../../test/transactions/across-protocol-base-opt-0xe1cb6100.json';

describe('Across Protocol Source', () => {
  it('Should detect transaction', () => {
    const isAcrossProtocolSource1 = detect(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(isAcrossProtocolSource1).toBe(true);

    const isAcrossProtocolSource2 = detect(
      acrossProtocolBaseOpt0xe1cb6100 as unknown as Transaction,
    );
    expect(isAcrossProtocolSource2).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      acrossProtocolBaseEth0xfc9a2f83 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0xb74091a5c0073f64f7b5246fd73715b9730581f6 BRIDGED 0.1 ETH to 1',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      acrossProtocolBaseOpt0xe1cb6100 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x8d25b3e415ee15bc404a7b46dd866f2f86ddbf0f BRIDGED 0.0000000012369026 ETH to 10',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});
import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import starGateSource0xed8d2725 from '../../test/transactions/starGateSource-0xed8d2725.json';
import starGateSource0x577fd364 from '../../test/transactions/starGateSource-0x577fd364.json';

describe('StarGate Source', () => {
  it('Should detect transaction', () => {
    const isStarGateSource1 = detect(
      starGateSource0xed8d2725 as unknown as Transaction,
    );
    expect(isStarGateSource1).toBe(true);

    const isStarGateSource2 = detect(
      starGateSource0x577fd364 as unknown as Transaction,
    );
    expect(isStarGateSource2).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      starGateSource0xed8d2725 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction1.context)).toBe(
      '0xe32adaa5ae4a32e28a6967d9780047d45cf120b1 BRIDGED 0.001341312588796022 ETH to 8453',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      starGateSource0x577fd364 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Bridge');
    expect(contextSummary(transaction2.context)).toBe(
      '0x6b638d60e0718f27f0f0d60d3513206632c41980 BRIDGED 0.004997 ETH to 8453',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);
  });
});

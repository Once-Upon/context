import { Transaction } from '../../../types';
import { detect, generate } from './plotAction';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import skyoneerPlotAction0x9436b659 from '../../test/transactions/skyoneerPlotAction-0x9436b659.json';
import skyoneerPlotAction0x9bb5a737 from '../../test/transactions/skyoneerPlotAction-0x9bb5a737.json';
import skyoneerPlotAction0x496c6309 from '../../test/transactions/skyoneerPlotAction-0x496c6309.json';

describe('Skyoneer PlotAction', () => {
  it('Should detect transaction', () => {
    const isPlotAction1 = detect(
      skyoneerPlotAction0x9436b659 as unknown as Transaction,
    );
    expect(isPlotAction1).toBe(true);

    const isPlotAction2 = detect(
      skyoneerPlotAction0x9bb5a737 as unknown as Transaction,
    );
    expect(isPlotAction2).toBe(true);

    const isPlotAction3 = detect(
      skyoneerPlotAction0x496c6309 as unknown as Transaction,
    );
    expect(isPlotAction3).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      skyoneerPlotAction0x9436b659 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Skyoneer');
    expect(contextSummary(transaction1.context)).toBe(
      '0x402533d5240a0c51e02d3714c0d0a057384d4872 HARVESTED_PLOT 257 0x9c82ca3332898bea9c9fa5f9642ba4a4628e1321',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    const transaction2 = generate(
      skyoneerPlotAction0x9bb5a737 as unknown as Transaction,
    );
    expect(transaction2.context?.summaries?.en.title).toBe('Skyoneer');
    expect(contextSummary(transaction2.context)).toBe(
      '0xf1fbb7b98d1fd2037e80ac41486d761ccf7735e7 CLEARED_HARVEST',
    );
    expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      skyoneerPlotAction0x496c6309 as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('Skyoneer');
    expect(contextSummary(transaction3.context)).toBe(
      '0x402533d5240a0c51e02d3714c0d0a057384d4872 PLANTED 36 0x9c82ca3332898bea9c9fa5f9642ba4a4628e1321',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);
  });
});

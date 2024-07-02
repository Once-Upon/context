import { Transaction } from '../../../types';
import { detect, generate } from './plotAction';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import cropXyzPlotAction0x9436b659 from '../../test/transactions/cropXyzPlotAction-0x9436b659.json';
import cropXyzPlotAction0x9bb5a737 from '../../test/transactions/cropXyzPlotAction-0x9bb5a737.json';
import cropXyzPlotAction0x496c6309 from '../../test/transactions/cropXyzPlotAction-0x496c6309.json';

describe('CropXYZ PlotAction', () => {
  it('Should detect transaction', () => {
    const isPlotAction1 = detect(
      cropXyzPlotAction0x9436b659 as unknown as Transaction,
    );
    expect(isPlotAction1).toBe(true);

    const isPlotAction2 = detect(
      cropXyzPlotAction0x9bb5a737 as unknown as Transaction,
    );
    expect(isPlotAction2).toBe(true);

    const isPlotAction3 = detect(
      cropXyzPlotAction0x496c6309 as unknown as Transaction,
    );
    expect(isPlotAction3).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      cropXyzPlotAction0x9436b659 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('CropXYZ');
    expect(contextSummary(transaction1.context)).toBe(
      '0x402533d5240a0c51e02d3714c0d0a057384d4872 HARVESTED_PLOT 257 0x9c82ca3332898bea9c9fa5f9642ba4a4628e1321',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);

    // const transaction2 = generate(
    //   cropXyzPlotAction0x9bb5a737 as unknown as Transaction,
    // );
    // expect(transaction2.context?.summaries?.en.title).toBe('CropXYZ');
    // expect(contextSummary(transaction2.context)).toBe(
    //   '0x402533d5240A0c51e02d3714C0D0A057384D4872 HARVESTED_PLOT 257 0x9c82ca3332898bea9c9fa5f9642ba4a4628e1321',
    // );
    // expect(containsBigInt(transaction2.context)).toBe(false);

    const transaction3 = generate(
      cropXyzPlotAction0x496c6309 as unknown as Transaction,
    );
    expect(transaction3.context?.summaries?.en.title).toBe('CropXYZ');
    expect(contextSummary(transaction3.context)).toBe(
      '0x402533d5240a0c51e02d3714c0d0a057384d4872 STAKED_CROP 36 0x9c82ca3332898bea9c9fa5f9642ba4a4628e1321',
    );
    expect(containsBigInt(transaction3.context)).toBe(false);
  });
});

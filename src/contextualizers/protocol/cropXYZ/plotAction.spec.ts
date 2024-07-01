import { Transaction } from '../../../types';
import { detect, generate } from './source';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import cropXyzPlotAction0x98d62314 from '../../test/transactions/cropXyzPlotAction-0x98d62314.json';

describe('CropXYZ PlotAction', () => {
  it('Should detect transaction', () => {
    const isPlotAction1 = detect(
      cropXyzPlotAction0x98d62314 as unknown as Transaction,
    );
    expect(isPlotAction1).toBe(true);
  });

  it('Should generate context', () => {
    const transaction1 = generate(
      cropXyzPlotAction0x98d62314 as unknown as Transaction,
    );
    expect(transaction1.context?.summaries?.en.title).toBe('Gold');
    expect(contextSummary(transaction1.context)).toBe(
      '0x9a37e57d177c5ff8817b55da36f2a2b3532cde3f ACTIVATED_A_STARTER_PACK',
    );
    expect(containsBigInt(transaction1.context)).toBe(false);
  });
});

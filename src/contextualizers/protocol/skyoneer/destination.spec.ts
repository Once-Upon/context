import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldDestination0x2b1c6528 from '../../test/transactions/goldDestination-0x2b1c6528.json';
import skyoneerPlotAction0x8f2296de from '../../test/transactions/skyoneerPlotAction-0x8f2296de.json';

describe('Skyoneer Destination', () => {
  it('Should detect transaction', () => {
    const isSkyoneerDestination1 = detect(
      goldDestination0x2b1c6528 as unknown as Transaction,
    );
    expect(isSkyoneerDestination1).toBe(true);

    const isSkyoneerDestination2 = detect(
      skyoneerPlotAction0x8f2296de as unknown as Transaction,
    );
    expect(isSkyoneerDestination2).toBe(true);
  });

  describe('Should generate context', () => {
    it('Should generate context for one tx', () => {
      const transaction1 = generate(
        goldDestination0x2b1c6528 as unknown as Transaction,
      );
      expect(transaction1.context?.summaries?.en.title).toBe('Skyoneer');
      expect(contextSummary(transaction1.context)).toBe(
        '0x9a37e57d177c5ff8817b55da36f2a2b3532cde3f RECEIVED plots 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #4 and 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #5 and 202816 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction1.context)).toBe(false);

      const transaction2 = generate(
        skyoneerPlotAction0x8f2296de as unknown as Transaction,
      );
      expect(transaction2.context?.summaries?.en.title).toBe('Skyoneer');
      expect(contextSummary(transaction2.context)).toBe(
        '0x747ae38aa9595360febaae72e49840834bb9fcf2 RECEIVED 1 plot and 1369000 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction2.context)).toBe(false);
    });
  });
});

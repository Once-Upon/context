import { Transaction } from '../../types';
import { detect, generate } from './basepaint';
import { contextSummary } from '../../helpers/utils';

import basepaintPaint0x95ad4c45 from '../../test/transactions/basepaint-paint-0x95ad4c45.json';
import basepaintAuthorWithdraw0xf5112a9d from '../../test/transactions/basepaint-author-withdraw-0xf5112a9d.json';
import basepaintAuthorWithdrawMultiple0xcdcf765d from '../../test/transactions/basepaint-author-withdraw-multiple-0xcdcf765d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('basepaint', () => {
  describe('paint', () => {
    it('Should detect transaction', () => {
      const match = detect(basepaintPaint0x95ad4c45 as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(basepaintPaint0x95ad4c45 as Transaction);
      expect(transaction.context?.summaries?.en.title).toBe('Basepaint');
      expect(contextSummary(transaction.context)).toBe(
        '0x1fbc7667cbc465d1bcde45505c74f500255d68ca PAINTED 200 pixels to day 215 using 0xd68fe5b53e7e1abeb5a4d0a6660667791f39263a #2239',
      );
    });
  });

  describe('authorWithdraw', () => {
    it('Should detect transaction', () => {
      const match = detect(basepaintAuthorWithdraw0xf5112a9d as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        basepaintAuthorWithdraw0xf5112a9d as Transaction,
      );
      expect(transaction.context?.summaries?.en.title).toBe('Basepaint');
      expect(contextSummary(transaction.context)).toBe(
        "0xbaaded465968bd53fbe1915e356ff815d85ee71f WITHDREW_REWARDS of 0.054157269702083366 ETH for 1 day's contributions",
      );
    });

    it('Should pluralize days', () => {
      const transaction = generate(
        basepaintAuthorWithdrawMultiple0xcdcf765d as Transaction,
      );
      expect(contextSummary(transaction.context)).toBe(
        "0xa9348391a8d8fb9f907e7db16f9f73b4aeab831f WITHDREW_REWARDS of 0.04651262416492829 ETH for 39 days' contributions",
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detect(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });
  });
});

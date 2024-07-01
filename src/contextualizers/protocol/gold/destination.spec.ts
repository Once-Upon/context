import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldDestination0x2b1c6528 from '../../test/transactions/goldDestination-0x2b1c6528.json';

describe('Gold Destination', () => {
  it('Should detect transaction', () => {
    const isGoldDestination1 = detect(
      goldDestination0x2b1c6528 as unknown as Transaction,
    );
    expect(isGoldDestination1).toBe(true);
  });

  describe('Should generate context', () => {
    it('Should generate context for one tx', () => {
      const transaction1 = generate(
        goldDestination0x2b1c6528 as unknown as Transaction,
      );
      expect(transaction1.context?.summaries?.en.title).toBe('Gold');
      expect(contextSummary(transaction1.context)).toBe(
        '0xB374FDD2951A65e827Dab88f692a6819dc43c6D7 RECEIVED plots 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #0 and 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #1 and 81 0x12647ceec053d386a7343b7739a1e1fddadef796 and 912670 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction1.context)).toBe(false);
    });
  });
});

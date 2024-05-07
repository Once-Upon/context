import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldDestination0x85058886 from '../../test/transactions/goldDestination-0x85058886.json';
import goldDestination0x469f8c9c from '../../test/transactions/goldDestination-0x469f8c9c.json';

describe('Gold Destination', () => {
  it('Should detect transaction', () => {
    const isGoldDestination1 = detect(
      goldDestination0x85058886 as unknown as Transaction,
    );
    expect(isGoldDestination1).toBe(true);

    const isGoldDestination2 = detect(
      goldDestination0x469f8c9c as unknown as Transaction,
    );
    expect(isGoldDestination2).toBe(true);
  });

  describe('Should generate context', () => {
    it('Should generate context for one tx', () => {
      const transaction1 = generate(
        goldDestination0x85058886 as unknown as Transaction,
      );
      expect(transaction1.context?.summaries?.en.title).toBe('Gold');
      expect(contextSummary(transaction1.context)).toBe(
        '0xB374FDD2951A65e827Dab88f692a6819dc43c6D7 RECEIVED plots 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #0 and 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #1 and 81 0x12647ceec053d386a7343b7739a1e1fddadef796 and 912670 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction1.context)).toBe(false);
    });
    it('Should generate context for another tx', () => {
      const transaction2 = generate(
        goldDestination0x469f8c9c as unknown as Transaction,
      );
      expect(transaction2.context?.summaries?.en.title).toBe('Gold');
      expect(contextSummary(transaction2.context)).toBe(
        '0x18F33CEf45817C428d98C4E188A770191fDD4B79 RECEIVED plots 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #2 and 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #3 and 9 0x56d66d7637f5b6235ad212043d35cc5e035dac68 and 202816 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction2.context)).toBe(false);
    });
  });
});

import { Transaction } from '../../../types';
import { detect, generate } from './destination';
import { containsBigInt, contextSummary } from '../../../helpers/utils';
import goldDestination0x2b1c6528 from '../../test/transactions/goldDestination-0x2b1c6528.json';

describe('CropXYZ Destination', () => {
  it('Should detect transaction', () => {
    const isCropXYZDestination1 = detect(
      goldDestination0x2b1c6528 as unknown as Transaction,
    );
    expect(isCropXYZDestination1).toBe(true);
  });

  describe('Should generate context', () => {
    it('Should generate context for one tx', () => {
      const transaction1 = generate(
        goldDestination0x2b1c6528 as unknown as Transaction,
      );
      expect(transaction1.context?.summaries?.en.title).toBe('CropXYZ');
      expect(contextSummary(transaction1.context)).toBe(
        '0x9a37e57d177c5ff8817b55da36f2a2b3532cde3f RECEIVED plots 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #4 and 0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8 #5 and 9 0xf4a785a80d91cadc149f778ee17d35cd008203f7 and 202816 0x387d73bd8682dceb3327b940213d5de50ee2bba2',
      );
      expect(containsBigInt(transaction1.context)).toBe(false);
    });
  });
});

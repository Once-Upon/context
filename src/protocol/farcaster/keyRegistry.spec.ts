import { Transaction } from '../../types';
import { detectKeyRegistry, generateKeyRegistryContext } from './keyRegistry';
import farcasterRemove0x742d8d1a from '../../test/transactions/farcaster-remove-0x742d8d1a.json';
import farcasterRemoveFor0xc199aa16 from '../../test/transactions/farcaster-removeFor-0xc199aa16.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('KeyRegistry', () => {
  describe('remove', () => {
    it('Should detect transaction', () => {
      const match = detectKeyRegistry(farcasterRemove0x742d8d1a as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generateKeyRegistryContext(
        farcasterRemove0x742d8d1a as Transaction,
      );
      expect(transaction.context.variables.owner['value']).toBe(
        '0x0294dde5d521eed2c1ecf6b1464ac1fade9313c9',
      );
    });
  });

  describe('removeFor', () => {
    it('Should detect transaction', () => {
      const match = detectKeyRegistry(
        farcasterRemoveFor0xc199aa16 as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generateKeyRegistryContext(
        farcasterRemoveFor0xc199aa16 as Transaction,
      );
      expect(transaction.context.variables.caller['value']).toBe(
        '0xbe0c12b56aa9b4f5dde36c733b3a2997ed775a4f',
      );
      expect(transaction.context.variables.owner['value']).toBe(
        '0xa0114Ba7Fe57Ad00Afb47e3bC1CC0b122d28dF89',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detectKeyRegistry(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });
  });
});

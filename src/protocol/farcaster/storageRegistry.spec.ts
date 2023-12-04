import { Transaction } from '../../types';
import {
  detectStorageRegistry,
  generateStorageRegistryContext,
} from './storageRegistry';
import farcasterRent0x09794a62 from '../../test/transactions/farcaster-rent-0x09794a62.json';
import farcasterRentMany0x4a23db3d from '../../test/transactions/farcaster-rentMany-0x4a23db3d.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('StorageRegistry', () => {
  describe('rent', () => {
    it('Should detect transaction', () => {
      const match = detectStorageRegistry(
        farcasterRent0x09794a62 as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generateStorageRegistryContext(
        farcasterRent0x09794a62 as Transaction,
      );
      expect(transaction.context.variables.caller['value']).toBe(
        '0x3a4afca659f54922a0d7a7b0bebabf641dec66bb',
      );
      expect(transaction.context.variables.fid['value']).toBe(
        '196573',
      );
      expect(transaction.context.variables.units['value']).toBe(
        '1 storage unit',
      );
    });

    it('Should pluralize units', () => {
      const transaction = generateStorageRegistryContext(
        farcasterRentMany0x4a23db3d as Transaction,
      );
      expect(transaction.context.variables.caller['value']).toBe(
        '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
      );
      expect(transaction.context.variables.fid['value']).toBe(
        '12350',
      );
      expect(transaction.context.variables.units['value']).toBe(
        '2 storage units',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detectStorageRegistry(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });

    it('Should not throw an unhandled error for methods not in abi', () => {
      const mockTxn = {
        ...catchall0xc35c01ac,
        to: farcasterRent0x09794a62.to,
      };

      expect(() => detectStorageRegistry(mockTxn as Transaction)).not.toThrow();
    });
  });
});

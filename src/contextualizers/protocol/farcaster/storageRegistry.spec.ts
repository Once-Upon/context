import { Transaction } from '../../../types';
import { detect, generate } from './storageRegistry';
import farcasterRent0x09794a62 from '../../test/transactions/farcaster-rent-0x09794a62.json';
import farcasterRentMany0x4a23db3d from '../../test/transactions/farcaster-rentMany-0x4a23db3d.json';
import farcasterBatchRentMOCK from '../../test/transactions/farcaster-batchRent-MOCK.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';
import { contextSummary } from '../../../helpers/utils';

describe('StorageRegistry', () => {
  describe('rent', () => {
    it('Should detect transaction', () => {
      const match = detect(farcasterRent0x09794a62 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterRent0x09794a62 as unknown as Transaction,
      );
      expect(transaction.context?.variables?.rented?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.caller['value']).toBe(
        '0x3a4afca659f54922a0d7a7b0bebabf641dec66bb',
      );
      expect(transaction.context?.variables?.fid['value']).toBe('196573');
      expect(transaction.context?.variables?.units['value']).toBe(1);
      const desc = contextSummary(transaction.context);
      expect(desc).toBe(
        '0x3a4afca659f54922a0d7a7b0bebabf641dec66bb RENTED 1 storage unit for Farcaster ID 196573',
      );
    });

    it('Should pluralize units', () => {
      const transaction = generate(
        farcasterRentMany0x4a23db3d as unknown as Transaction,
      );
      expect(transaction.context?.variables?.caller['value']).toBe(
        '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
      );
      expect(transaction.context?.variables?.fid['value']).toBe('12350');
      expect(transaction.context?.variables?.units['value']).toBe(2);
      const desc = contextSummary(transaction.context);
      expect(desc).toBe(
        '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2 RENTED 2 storage units for Farcaster ID 12350',
      );
    });
  });

  // TODO: this function has as of 2023-12-07 never been called on mainnet so
  // we're using a mock transaction in the test. replace with an actual
  // transaction
  describe('batchRent', () => {
    it('Should detect transaction', () => {
      const match = detect(farcasterBatchRentMOCK as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterBatchRentMOCK as unknown as Transaction,
      );
      expect(transaction.context?.variables?.rented?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.caller['value']).toBe(
        '0xbdfeb5439f5daecb78a17ff846645a8bdbbf5725',
      );
      expect(transaction.context?.variables?.fids['value']).toBe(2);
      expect(transaction.context?.variables?.units['value']).toBe(7);
      const desc = contextSummary(transaction.context);
      expect(desc).toBe(
        '0xbdfeb5439f5daecb78a17ff846645a8bdbbf5725 RENTED 7 storage units for 2 Farcaster IDs',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detect(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });

    it('Should not throw an unhandled error for methods not in abi', () => {
      const mockTxn = {
        ...catchall0xc35c01ac,
        to: farcasterRent0x09794a62.to,
      };

      expect(() => detect(mockTxn as Transaction)).not.toThrow();
    });
  });
});

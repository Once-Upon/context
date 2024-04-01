import { Transaction } from '../../types';
import { detect, generate } from './keyGateway';
import farcasterAdd0x9e5f9b45 from '../../test/transactions/farcaster-add-0x9e5f8b45.json';
import farcasterAddFor0x3152d411 from '../../test/transactions/farcaster-addFor-0x3152d411.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('KeyGateway', () => {
  describe('add', () => {
    it('Should detect transaction', () => {
      const match = detect(farcasterAdd0x9e5f9b45 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterAdd0x9e5f9b45 as unknown as Transaction,
      );
      expect(transaction.context?.variables?.addedKey?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.owner['value']).toBe(
        '0x69c17616db84327978a80c45ae565d0b0bfa25b9',
      );
    });
  });

  describe('addFor', () => {
    it('Should detect transaction', () => {
      const match = detect(farcasterAddFor0x3152d411 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterAddFor0x3152d411 as unknown as Transaction,
      );
      expect(transaction.context?.variables?.addedKey?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.caller['value']).toBe(
        '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
      );
      expect(transaction.context?.variables?.owner['value']).toBe(
        '0xdC3449b38F9441d78A84Eb5aC95378a8557CEb00',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detect(catchall0xc35c01ac as unknown as Transaction);
      expect(match).toBe(false);
    });

    it('Should not throw an unhandled error for methods not in abi', () => {
      const mockTxn = {
        ...catchall0xc35c01ac,
        to: farcasterAdd0x9e5f9b45.to,
      };

      expect(() => detect(mockTxn as unknown as Transaction)).not.toThrow();
    });
  });
});

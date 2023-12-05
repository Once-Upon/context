import { Transaction } from '../../types';
import { detectBundler, generateBundlerContext } from './bundler';
import farcasterBundlerRegister0x7b8fe471 from '../../test/transactions/farcaster-bundler-register-0x7b8fe471.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Bundler', () => {
  describe('register', () => {
    it('Should detect transaction', () => {
      const match = detectBundler(
        farcasterBundlerRegister0x7b8fe471 as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generateBundlerContext(
        farcasterBundlerRegister0x7b8fe471 as Transaction,
      );
      expect(transaction.context.summaries.en.variables.registered?.type).toBe(
        'contextAction',
      );
      expect(transaction.context.variables.caller['value']).toBe(
        '0x56ad2cd6ad6f52c72181b93ac66d5dc887c3d0bd',
      );
      expect(transaction.context.variables.owner['value']).toBe(
        '0x109408193a2b17e1a641740655fB798d929A7554',
      );
      expect(transaction.context.variables.fid['value']).toBe('196541');
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detectBundler(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });

    it('Should not throw an unhandled error for methods not in abi', () => {
      const mockTxn = {
        ...catchall0xc35c01ac,
        to: farcasterBundlerRegister0x7b8fe471.to,
      };

      expect(() => detectBundler(mockTxn as Transaction)).not.toThrow();
    });
  });
});

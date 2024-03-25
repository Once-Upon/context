import { Transaction } from '../../../types';
import { detect, generate } from './idGateway';
import farcasterRegister0x6b0f32e0 from '../../test/transactions/farcaster-register-0x6b0f32e0.json';
import farcasterRegisterForMOCK from '../../test/transactions/farcaster-registerFor-MOCK.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('IdGateway', () => {
  describe('register', () => {
    it('Should detect transaction', () => {
      const match = detect(
        farcasterRegister0x6b0f32e0 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterRegister0x6b0f32e0 as unknown as Transaction,
      );
      expect(transaction.context?.variables?.registered?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.owner['value']).toBe(
        '0x177685ab0b27690cbdf7f44d6846d3c56b36382b',
      );
      expect(transaction.context?.variables?.fid['value']).toBe('196379');
    });
  });

  // TODO: this function has as of 2023-12-07 never been called on mainnet so
  // we're using a mock transaction in the test. replace with an actual
  // transaction
  describe('registerFor', () => {
    it('Should detect transaction', () => {
      const match = detect(farcasterRegisterForMOCK as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        farcasterRegisterForMOCK as unknown as Transaction,
      );
      expect(transaction.context?.variables?.registered?.type).toBe(
        'contextAction',
      );
      expect(transaction.context?.variables?.owner['value']).toBe(
        '0x1337aB3f69Ea7bf5C6D68879bb2017dE624256e1',
      );
      expect(transaction.context?.variables?.fid['value']).toBe('197703');
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
        to: farcasterRegister0x6b0f32e0.to,
      };

      expect(() => detect(mockTxn as Transaction)).not.toThrow();
    });
  });
});

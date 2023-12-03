import { Transaction } from '../../types';
import { detectIdGateway, generateIdGatewayContext } from './idGateway';
import farcasterRegister0x6b0f32e0 from '../../test/transactions/farcaster-register-0x6b0f32e0.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('IdGateway', () => {
  describe('register', () => {
    it('Should detect transaction', () => {
      const match = detectIdGateway(farcasterRegister0x6b0f32e0 as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generateIdGatewayContext(
        farcasterRegister0x6b0f32e0 as Transaction,
      );
      expect(transaction.context.variables.owner['value']).toBe(
        '0x177685ab0b27690cbdf7f44d6846d3c56b36382b',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detectIdGateway(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });
  });
});

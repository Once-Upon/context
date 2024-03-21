import { Transaction } from '../../types';
import { detect, generate } from './schemaRegistry';
import { contextSummary } from '../../helpers/utils';
import schemaRegistryRegister0x87fc8922 from '../../test/transactions/eas-schema-registry-register-0x87fc8922.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('SchemaRegistry', () => {
  describe('register', () => {
    it('Should detect transaction', () => {
      const match = detect(
        schemaRegistryRegister0x87fc8922 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        schemaRegistryRegister0x87fc8922 as unknown as Transaction,
      );
      expect(transaction.context?.summaries?.en.title).toBe('EAS');

      expect(contextSummary(transaction.context)).toBe(
        '0x4fa65b8e4d2018dff11c7aaf460548e413b844b1 REGISTERED new schema with id 0x5dcd6fd9212455e1d21d9236e0dfbdc8b35d37343a083d8f8d3c317352880ab5',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect transaction', () => {
      const match = detect(catchall0xc35c01ac as Transaction);
      expect(match).toBe(false);
    });
  });
});

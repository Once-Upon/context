import { Transaction } from '../../../types';
import { detect, generate } from './accountAbstraction';
import { contextSummary } from '../../../helpers/utils';

import accountAbstractionSingleBundle0x6ae53f78 from '../../test/transactions/erc4337-eth-transfer-0x6ae53f78.json';
import accountAbstractionMultipleBundles0xc7d49ad1 from '../../test/transactions/erc4337-multiple-ops-0xc7d49ad1.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

describe('Token Transfer', () => {
  it('Should detect token transfer transaction', () => {
    const accountAbstraction = detect(
      accountAbstractionSingleBundle0x6ae53f78 as unknown as Transaction,
    );
    expect(accountAbstraction).toBe(true);
  });

  it('Should not detect accountAbstraction transaction', () => {
    const other = detect(catchall0xc35c01ac as unknown as Transaction);
    expect(other).toBe(false);
  });

  describe('Should generate context', () => {
    it('works with 1 bundle', () => {
      const transaction = generate(
        accountAbstractionSingleBundle0x6ae53f78 as unknown as Transaction,
      );

      expect(transaction.context?.summaries?.en.title).toBe('ERC4337 Bundle');
      expect(contextSummary(transaction.context)).toBe(
        '0xa5fdfcbceeceb5741ef73f86cf3ed6e80e5e920d SUBMITTED_ACCOUNT_ABSTRACTION_BUNDLE with 1 user op',
      );
    });

    it('works with multiple bundles', () => {
      const transaction = generate(
        accountAbstractionMultipleBundles0xc7d49ad1 as unknown as Transaction,
      );

      expect(transaction.context?.summaries?.en.title).toBe('ERC4337 Bundle');
      expect(contextSummary(transaction.context)).toBe(
        '0x13284299074631de638be076a5aaf73b1d471afd SUBMITTED_ACCOUNT_ABSTRACTION_BUNDLE with 2 user ops',
      );
    });
  });
});

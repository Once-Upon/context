import { Transaction } from '../../types';
import { detect, generate } from './eas';
import { contextSummary } from '../../helpers/utils';
import easAttest0xfed2349f from '../../test/transactions/eas-attest-mainnet-0xfed2349f.json';
import easAttestByDelegation0xb58d6544 from '../../test/transactions/eas-attest-by-delegation-optimism-0xb58d6544.json';
import easMultiAttest0x9bab2b2e from '../../test/transactions/eas-multi-attest-linea-0x9bab2b2e.json';
import easRevoke0x4ec6335e from '../../test/transactions/eas-revoke-base-0x4ec6335e.json';
import easTimestamp0x892d0c6e from '../../test/transactions/eas-timestamp-base-0x892d0c6e.json';
import easRevokeOffchain0xf38b96d0 from '../../test/transactions/eas-revoke-offchain-mainnet-0xf38b96d0.json';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

// TODO: add tests for functions that haven't been called in production yet:
// - multiAttestByDelegation
// - revokeByDelegation
// - multiRevoke
// - multiRevokeByDelegation
// - multiTimestamp
// - multiRevokeOffChain

describe('EAS', () => {
  describe('attest', () => {
    it('Should detect transaction', () => {
      const match = detect(easAttest0xfed2349f as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(easAttest0xfed2349f as Transaction);

      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0x3b60e31cfc48a9074cd5bebb26c9eaa77650a43f ATTESTED to 0x9934465Ee73BeAF148b1b3Ff232C8cD86c4c2c63 with schema 0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7 🔗 link',
      );
    });
  });

  describe('attestByDelegation', () => {
    it('Should detect transaction', () => {
      const match = detect(easAttestByDelegation0xb58d6544 as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        easAttestByDelegation0xb58d6544 as Transaction,
      );

      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0xc13D679471FEa46193891343EEAF761bFc52808E ATTESTED to 0x917DE4FEc44841312F632D2A020867Fe0c6AeA43 with schema 0xeb2a4b4be5355128b420a8045a47750aab8ba427014401387a564bbed987d16c by delegation via 0x917de4fec44841312f632d2a020867fe0c6aea43 🔗 link',
      );
    });
  });

  describe('multiAttest', () => {
    it('Should detect transaction', () => {
      const match = detect(easMultiAttest0x9bab2b2e as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(easMultiAttest0x9bab2b2e as Transaction);
      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0x0fb166cddf1387c5b63ffa25721299fd7b068f3f ATTESTED 2 times with 1 schema',
      );
    });
  });

  describe('revoke', () => {
    it('Should detect transaction', () => {
      const match = detect(easRevoke0x4ec6335e as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(easRevoke0x4ec6335e as Transaction);
      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0x6e91973dee716ed6859e7bb689c9bd2955bdb96e REVOKED an attestation with schema 0xd3f24e873e8df2d9bb9af6f08ea1ddf61f65754d023f3ea761081e3e6a226a80 🔗 link',
      );
    });
  });

  describe('timestamp', () => {
    it('Should detect transaction', () => {
      const match = detect(easTimestamp0x892d0c6e as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(easTimestamp0x892d0c6e as Transaction);
      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0x79ffc4cf151373226dcc59c9582395214a364358 TIMESTAMPED data',
      );
    });
  });

  describe('revokeOffchain', () => {
    it('Should detect transaction', () => {
      const match = detect(easRevokeOffchain0xf38b96d0 as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(easRevokeOffchain0xf38b96d0 as Transaction);
      expect(transaction.context.summaries.en.title).toBe('EAS');
      expect(contextSummary(transaction.context)).toBe(
        '0xb2370e24dabd855bfcf87087740ca6bdb77ebd50 REVOKED offchain data',
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

import { Transaction } from '../../types';
import { contextSummary } from '../../helpers/utils';
import { detect, generate } from './governor';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

import nounsBuilderGovernorUnknownPropose0x9cd7254f from '../../test/transactions/nouns-builder-governor-unknown-propose-0x9cd7254f.json';
import nounsBuilderGovernorPurplePropose0xba1da3ed from '../../test/transactions/nouns-builder-governor-purple-propose-0xba1da3ed.json';

import nounsBuilderGovernorUnknownCastVwr0x2d5ce9c2 from '../../test/transactions/nouns-builder-governor-unknown-cast-vwr-0x2d5ce9c2.json';
import nounsBuilderGovernorPurpleCastVwr0xe7d4d391 from '../../test/transactions/nouns-builder-governor-purple-cast-vwr-0xe7d4d391.json';
import nounsBuilderGovernorPurpleCastVwrAbstain0x7107ece4 from '../../test/transactions/nouns-builder-governor-purple-cast-vwr-abstain-0x7107ece4.json';

import nounsBuilderGovernorUnknownQueue0x1f6ac5ad from '../../test/transactions/nouns-builder-governor-unknown-queue-0x1f6ac5ad.json';
import nounsBuilderGovernorBlvkhvndQueue0x1f6ac5ad from '../../test/transactions/nouns-builder-governor-blvkhvnd-queue-0xb3852ad9.json';

import nounsBuilderGovernorUnknownExecute0x2d865904 from '../../test/transactions/nouns-builder-governor-unknown-execute-0x2d865904.json';
import nounsBuilderGovernorBuilderExecute0x3affa949 from '../../test/transactions/nouns-builder-governor-builder-execute-0x3affa949.json';

import nounsBuilderGovernorUnknownCancel0x1051b9dd from '../../test/transactions/nouns-builder-governor-unknown-cancel-0x1051b9dd.json';
import nounsBuilderGovernorBlvkhvndCancel0x524b1e31 from '../../test/transactions/nouns-builder-governor-blvkhvnd-cancel-0x524b1e31.json';

describe('NounsBuilderDAO Governor', () => {
  describe('propose', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderGovernorUnknownPropose0x9cd7254f as Transaction,
      );
      expect(unknown).toBe(true);

      const purple = detect(
        nounsBuilderGovernorPurplePropose0xba1da3ed as Transaction,
      );
      expect(purple).toBe(true);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderGovernorUnknownPropose0x9cd7254f as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0x42da267398801b1b96948f106d117d87b6e74c34 CREATED_PROPOSAL 0x6f2f1ddcb342f7f3661e4aaec9fcb25fd32eb9a780f6f7e301986ac776ff57cc',
      );

      const purple = generate(
        nounsBuilderGovernorPurplePropose0xba1da3ed as Transaction,
      );
      const purpleDesc = contextSummary(purple.context);
      expect(purpleDesc).toBe(
        '0xd6507fc98605eab8775f851c25a5e09dc12ab7a7 CREATED_PROPOSAL 0xafc452f09668a1f527aa6c3516fae0df9dc692b61fcbdf2af2c37ab631d03dc6 in Purple DAO',
      );
    });
  });

  describe('castVote', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderGovernorUnknownCastVwr0x2d5ce9c2 as Transaction,
      );
      expect(unknown).toBe(true);

      const purple = detect(
        nounsBuilderGovernorPurpleCastVwr0xe7d4d391 as Transaction,
      );
      expect(purple).toBe(true);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderGovernorUnknownCastVwr0x2d5ce9c2 as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xc61288821b4722ce29249f0ba03b633f0be46a5a VOTED in favor of proposal 0xf7d1482b17b76b192d04ef63832a78111f83974881190d18f642dca93d30c7d2',
      );

      const purple = generate(
        nounsBuilderGovernorPurpleCastVwr0xe7d4d391 as Transaction,
      );
      const purpleDesc = contextSummary(purple.context);
      expect(purpleDesc).toBe(
        '0x14b85b1c40056312fde55e1fa1827a92f12b966a VOTED against Purple DAO proposal 0x47d24160ba593a4bba7f61453a52edf874c4eb47ab46026d038cb8bb4569f40b',
      );

      const purple2 = generate(
        nounsBuilderGovernorPurpleCastVwrAbstain0x7107ece4 as Transaction,
      );
      const purpleDesc2 = contextSummary(purple2.context);
      expect(purpleDesc2).toBe(
        '0xceed9585854f12f81a0103861b83b995a64ad915 ABSTAINED from voting on Purple DAO proposal 0x47d24160ba593a4bba7f61453a52edf874c4eb47ab46026d038cb8bb4569f40b',
      );
    });
  });

  describe('queue', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderGovernorUnknownQueue0x1f6ac5ad as Transaction,
      );
      expect(unknown).toBe(true);

      const blvkhvnd = detect(
        nounsBuilderGovernorBlvkhvndQueue0x1f6ac5ad as Transaction,
      );
      expect(blvkhvnd).toBe(true);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderGovernorUnknownQueue0x1f6ac5ad as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xc61288821b4722ce29249f0ba03b633f0be46a5a QUEUED proposal 0xf7d1482b17b76b192d04ef63832a78111f83974881190d18f642dca93d30c7d2',
      );

      const blvkhvnd = generate(
        nounsBuilderGovernorBlvkhvndQueue0x1f6ac5ad as Transaction,
      );
      const blvkhvndDesc = contextSummary(blvkhvnd.context);
      expect(blvkhvndDesc).toBe(
        '0xeb95ff72eab9e8d8fdb545fe15587accf410b42e QUEUED BLVKHVND DAO proposal 0x2c5b887afa8a76292dadfb4c0dde0305e7c972581815dda8a4a0cd2e8caa6723',
      );
    });
  });

  describe('execute', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderGovernorUnknownExecute0x2d865904 as Transaction,
      );
      expect(unknown).toBe(true);

      const builder = detect(
        nounsBuilderGovernorBuilderExecute0x3affa949 as Transaction,
      );
      expect(builder).toBe(true);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderGovernorUnknownExecute0x2d865904 as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xc61288821b4722ce29249f0ba03b633f0be46a5a EXECUTED proposal 0xf7d1482b17b76b192d04ef63832a78111f83974881190d18f642dca93d30c7d2',
      );

      const builder = generate(
        nounsBuilderGovernorBuilderExecute0x3affa949 as Transaction,
      );
      const builderDesc = contextSummary(builder.context);
      expect(builderDesc).toBe(
        '0xdcf37d8aa17142f053aaa7dc56025ab00d897a19 EXECUTED Builder DAO proposal 0xd20f651d0355d2fe636cbf0b29ca6bdc32ad49439f43ff782ca3e27249b90538',
      );
    });
  });

  describe('cancel', () => {
    it('Should detect transaction', () => {
      const unknown = detect(
        nounsBuilderGovernorUnknownCancel0x1051b9dd as Transaction,
      );
      expect(unknown).toBe(true);

      const blvkhvnd = detect(
        nounsBuilderGovernorBlvkhvndCancel0x524b1e31 as Transaction,
      );
      expect(blvkhvnd).toBe(true);
    });

    it('Should generate context', () => {
      const unknown = generate(
        nounsBuilderGovernorUnknownCancel0x1051b9dd as Transaction,
      );
      const unknownDesc = contextSummary(unknown.context);
      expect(unknownDesc).toBe(
        '0xfca577e20be5a193e7a6dc5e33d54229cfd1d1db CANCELED proposal 0x052cb9138ef978e33703293824c85f6a57c000ce5c9fd9da76e3e6ac9d9279e0',
      );

      const blvkhvnd = generate(
        nounsBuilderGovernorBlvkhvndCancel0x524b1e31 as Transaction,
      );
      const blvkhvndDesc = contextSummary(blvkhvnd.context);
      expect(blvkhvndDesc).toBe(
        '0xeb95ff72eab9e8d8fdb545fe15587accf410b42e CANCELED BLVKHVND DAO proposal 0x8df02eb8fe96392f3b8e666bc22211297aea89be2e5cddfabb7e54a0b29cc7b0',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect', () => {
      const other = detect(catchall0xc35c01ac as Transaction);
      expect(other).toBe(false);
    });
  });
});

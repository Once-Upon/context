import { Transaction } from '../../../types';
import { contextSummary, containsBigInt } from '../../../helpers/utils';
import { detect, generate } from './daoLogic';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

import nounsPropose0x43866eb1 from '../../test/transactions/nouns-propose-0x43866eb1.json';
import nounsProposeV40x037d933b from '../../test/transactions/nouns-propose-v4-0x037d933b.json';
import nounsProposeBySigs0xbc09b566 from '../../test/transactions/nouns-propose-by-sigs-0xbc09b566.json';
import nounsProposeBySigsV40xc67c3da3 from '../../test/transactions/nouns-propose-by-sigs-v4-0xc67c3da3.json';
import nounsCastVote0xeaf10956 from '../../test/transactions/nouns-cast-vote-0xeaf10956.json';
import nounsCastRefundableVote0x989966a2 from '../../test/transactions/nouns-cast-refundable-vote-0x989966a2.json';
import nounsCastRefundableVoteV40x31564e6a from '../../test/transactions/nouns-cast-refundable-vote-v4-0x31564e6a.json';
import nounsCastRefundableVwr0x4577a55a from '../../test/transactions/nouns-cast-refundable-vwr-0x4577a55a.json';
import nounsCastRefundableVwrV40x441947e7 from '../../test/transactions/nouns-cast-refundable-vwr-v4-0x441947e7.json';
import nounsQueue0x5949facf from '../../test/transactions/nouns-queue-0x5949facf.json';
import nounsExecute0x540c83cb from '../../test/transactions/nouns-execute-0x540c83cb.json';
import nounsCancel0xaae56ed7 from '../../test/transactions/nouns-cancel-0xaae56ed7.json';

describe('Nouns Governor', () => {
  describe('propose', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsPropose0x43866eb1 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context for V3', () => {
      const transaction = generate(
        nounsPropose0x43866eb1 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xa86882277e69fbf0a51805cdc8b0a3a113079e63 CREATED_PROPOSAL 463',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.description).toBeDefined();
    });

    it('Should generate context for V4', () => {
      const transaction = generate(
        nounsProposeV40x037d933b as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x4bf88042de0220647acb314af3c5f310aec3bcc0 CREATED_PROPOSAL 571',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.description).toBeDefined();
    });
  });

  describe('proposeBySigs', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsProposeBySigs0xbc09b566 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context for V3', () => {
      const transaction = generate(
        nounsProposeBySigs0xbc09b566 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x7916dba3a610b020d77c0ccfd4bd717ee400a5f2 CREATED_PROPOSAL 481',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.description).toBeDefined();
    });

    it('Should generate context for V4', () => {
      const transaction = generate(
        nounsProposeBySigsV40xc67c3da3 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x8e37d5fd47016fe5c671c7c1b980afbe6773595c CREATED_PROPOSAL 575',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.description).toBeDefined();
    });
  });

  describe('castVote', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsCastVote0xeaf10956 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsCastVote0xeaf10956 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xa5d7e4c18d223d1f142297d17e36d74ce7793a54 VOTED_FOR proposal 472',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('castRefundableVote', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsCastRefundableVote0x989966a2 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context for V3', () => {
      const transaction = generate(
        nounsCastRefundableVote0x989966a2 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xb0dd496ffffa300df1eff42702066aca81834404 ABSTAINED from voting on proposal 473',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });

    it('Should generate context for V4', () => {
      const transaction = generate(
        nounsCastRefundableVoteV40x31564e6a as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x10dec36b4ac9d3b60490dfe2799881287d4a74cc ABSTAINED from voting on proposal 573',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('castRefundableVoteWithReason', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsCastRefundableVwr0x4577a55a as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context for V3', () => {
      const transaction = generate(
        nounsCastRefundableVwr0x4577a55a as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xceed9585854f12f81a0103861b83b995a64ad915 VOTED_AGAINST proposal 471',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.reason).toBeDefined();
      expect(contextSummary(transaction.context, 'long')).toBe(
        '0xceed9585854f12f81a0103861b83b995a64ad915 VOTED_AGAINST proposal 471 I have concerns around creating this long of a stream and would rather see more specific focus for the use of funds. (eg directed to a pool of web3 related charitable efforts for example.) \n\nThis will likely pass but if it doesn’t I would vote for a 1 year stream with focused distribution. ',
      );
    });

    it('Should generate context for V4', () => {
      const transaction = generate(
        nounsCastRefundableVwrV40x441947e7 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xa86882277e69fbf0a51805cdc8b0a3a113079e63 VOTED_AGAINST proposal 571',
      );
      expect(containsBigInt(transaction.context)).toBe(false);

      expect(transaction?.context?.variables?.reason).toBeDefined();
      expect(contextSummary(transaction.context, 'long')).toBe(
        `0xa86882277e69fbf0a51805cdc8b0a3a113079e63 VOTED_AGAINST proposal 571 



+1

> I generally disagree with having a pool of Nouns available for swapping. For this specific proposal, I\'m voting no because traits should demand a premium when they come to auction if they\'re desired. It feels like part of the game.`,
      );
    });
  });

  describe('queue', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsQueue0x5949facf as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsQueue0x5949facf as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x10dec36b4ac9d3b60490dfe2799881287d4a74cc QUEUED proposal 474',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('execute', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsExecute0x540c83cb as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsExecute0x540c83cb as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x32d1a53f6709a03f4b6cf4cb0501204ba188d4f5 EXECUTED proposal 473',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('cancel', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsCancel0xaae56ed7 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsCancel0xaae56ed7 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xf2b7bfcdd6b596767e346269a8675472b45d098f CANCELED proposal 472',
      );
      expect(containsBigInt(transaction.context)).toBe(false);
    });
  });

  describe('Other transactions', () => {
    it('Should not detect', () => {
      const other = detect(catchall0xc35c01ac as unknown as Transaction);
      expect(other).toBe(false);
    });
  });
});

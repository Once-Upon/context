import { Transaction } from '../../../types';
import { contextSummary } from '../../../helpers/utils';
import { detect, generate } from './daoData';
import catchall0xc35c01ac from '../../test/transactions/catchall-0xc35c01ac.json';

import nounsCreateProposalCandidate0x340540b7 from '../../test/transactions/nouns-create-proposal-candidate-0x340540b7.json';
import nounsCreateProposalCandidateWithPropId0x155b1dfe from '../../test/transactions/nouns-create-proposal-candidate-with-proposal-id-0x155b1dfe.json';
import nounsUpdateProposalCandidate0xec3b54ba from '../../test/transactions/nouns-update-proposal-candidate-0xec3b54ba.json';
import nounsUpdateProposalCandidateWithPropId0xbaa93873 from '../../test/transactions/nouns-update-proposal-candidate-with-prop-id-0xbaa93873.json';
import nounsAddSignature0x6adbc4a5 from '../../test/transactions/nouns-add-signature-0x6adbc4a5.json';
import nounsAddSignatureWithPropId0x26d6d3a9 from '../../test/transactions/nouns-add-signature-with-prop-id-0x26d6d3a9.json';
import nounsSendFeedback0x9a60aa86 from '../../test/transactions/nouns-send-feedback-0x9a60aa86.json';
import nounsSendCandidateFeedback0x1ff922b4 from '../../test/transactions/nouns-send-candidate-feedback-0x1ff922b4.json';
import nounsCancelProposalCandidate0x1ff922b4 from '../../test/transactions/nouns-cancel-proposal-candidate-0xaa1038ec.json';

describe('NounsDAOData', () => {
  describe('createProposalCandidate', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsCreateProposalCandidate0x340540b7 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context when proposalIdToUpdate IS NOT set', () => {
      const transaction = generate(
        nounsCreateProposalCandidate0x340540b7 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x9c87a1065994f156f0b7b87aaa8b3c5f7bd67e02 CREATED_CANDIDATE pants-brown-accessory-0x9c87a1065994f156f0b7b87aaa8b3c5f7bd67e02',
      );
      expect(transaction?.context?.variables?.description).toBeDefined();
    });

    it('Should generate context when proposalIdToUpdate IS set', () => {
      const transaction = generate(
        nounsCreateProposalCandidateWithPropId0x155b1dfe as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x289715ffbb2f4b482e2917d2f183feab564ec84f UPDATED_PROPOSAL 582',
      );

      expect(transaction?.context?.variables?.description).toBeDefined();
    });
  });

  describe('updateProposalCandidate', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsUpdateProposalCandidate0xec3b54ba as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context when proposalIdToUpdate IS NOT set', () => {
      const transaction = generate(
        nounsUpdateProposalCandidate0xec3b54ba as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x2d71bab150528fc4d8549b5a2f3e860d75d17296 UPDATED_CANDIDATE shrimp-tempura-head-0x2d71bab150528fc4d8549b5a2f3e860d75d17296',
      );

      expect(transaction?.context?.variables?.description).toBeDefined();
    });

    it('Should generate context when proposalIdToUpdate IS set', () => {
      const transaction = generate(
        nounsUpdateProposalCandidateWithPropId0xbaa93873 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x560ddbb5ccaf91d27e91f0e7c0fa099e7ee179e6 UPDATED_PROPOSAL 468',
      );

      expect(transaction?.context?.variables?.description).toBeDefined();
    });
  });

  describe('addSignature', () => {
    it('Should detect transaction', () => {
      const match = detect(nounsAddSignature0x6adbc4a5 as unknown as Transaction);
      expect(match).toBe(true);
    });

    it('Should generate context when proposalIdToUpdate IS NOT set', () => {
      const transaction = generate(
        nounsAddSignature0x6adbc4a5 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xc7ccec521eed20fcddff8f95424816ac421c7d87 SPONSORED_CANDIDATE white-body-0xae4705dC0816ee6d8a13F1C72780Ec5021915Fed',
      );
    });

    it('Should generate context when proposalIdToUpdate IS set', () => {
      const transaction = generate(
        nounsAddSignatureWithPropId0x26d6d3a9 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x560ddbb5ccaf91d27e91f0e7c0fa099e7ee179e6 SPONSORED_PROPOSAL 582',
      );
    });

  });

  describe('sendFeedback', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsSendFeedback0x9a60aa86 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsSendFeedback0x9a60aa86 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0xca72c93172ba6eff168e59e7f17c3c7a8fea9b62 SIGNALED_FOR proposal 587',
      );
    });
  });

  describe('sendCandidateFeedback', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsSendCandidateFeedback0x1ff922b4 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsSendCandidateFeedback0x1ff922b4 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x4bf88042de0220647acb314af3c5f310aec3bcc0 SIGNALED_FOR candidate tabletop---sponsor-a-boardgaming-community-on-farcaster-0x3eEFAa9d6e2ab7972C1001D41C82BB4881389257',
      );
    });
  });

  describe('cancelProposalCandidate', () => {
    it('Should detect transaction', () => {
      const match = detect(
        nounsCancelProposalCandidate0x1ff922b4 as unknown as Transaction,
      );
      expect(match).toBe(true);
    });

    it('Should generate context', () => {
      const transaction = generate(
        nounsCancelProposalCandidate0x1ff922b4 as unknown as Transaction,
      );
      expect(transaction?.context?.summaries?.en.title).toBe('Nouns');
      expect(contextSummary(transaction.context)).toBe(
        '0x9097cdff0329382df4a17e86195cc664385656cb CANCELED_CANDIDATE candidate nouns-at-fwb-fest-2024-hosted-by-fridays-at-the-park-0x9097cdff0329382df4a17e86195cc664385656cb',
      );
    });
  });

  describe('Other transactions', () => {
    it('Should not detect', () => {
      const other = detect(catchall0xc35c01ac as unknown as Transaction);
      expect(other).toBe(false);
    });
  });
});

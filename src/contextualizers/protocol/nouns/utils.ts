import { Hex } from 'viem';
import { NounsGovernorActionEnum } from '../../../types';

export const translateSupport = (support: number) => {
  if (support === 0) return NounsGovernorActionEnum.VOTED_AGAINST;
  if (support === 1) return NounsGovernorActionEnum.VOTED_FOR;

  return NounsGovernorActionEnum.ABSTAINED;
};

export const translateSignalingSupport = (support: number) => {
  if (support === 0) return NounsGovernorActionEnum.SIGNALED_AGAINST;
  if (support === 1) return NounsGovernorActionEnum.SIGNALED_FOR;

  return NounsGovernorActionEnum.ABSTAINED;
};

export const proposalUrl = (proposalId: bigint | number) => {
  return `https://nouns.camp/proposals/${proposalId}`;
};

export const candidateUrl = (candidateId: string) => {
  return `https://nouns.camp/candidates/${candidateId}`;
};

export const candidateId = (proposer: Hex, slug: string) => {
  return `${slug}-${proposer}`;
};

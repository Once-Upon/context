import { NounsGovernorActionEnum } from '../../../types';

export const translateSupport = (support: number) => {
  if (support === 0) return NounsGovernorActionEnum.VOTED_AGAINST;
  if (support === 1) return NounsGovernorActionEnum.VOTED_FOR;

  return NounsGovernorActionEnum.ABSTAINED;
};

export const proposalUrl = (proposalId: bigint | number) => {
  return `https://nouns.camp/proposals/${proposalId}`;
};

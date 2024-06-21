export type HeuristicContextAction =
  | HeuristicContextActionEnum.BOUGHT
  | HeuristicContextActionEnum.BRIDGED
  | HeuristicContextActionEnum.DEPLOYED
  | HeuristicContextActionEnum.MINTED
  | HeuristicContextActionEnum.SWAPPED
  | HeuristicContextActionEnum.SENT
  | HeuristicContextActionEnum.RECEIVED
  | HeuristicContextActionEnum.COMMITTED_TO // Not yet used in this repo
  | HeuristicContextActionEnum.RECEIVED_AIRDROP
  | HeuristicContextActionEnum.GAVE_ACCESS
  | HeuristicContextActionEnum.REVOKED_ACCESS
  | HeuristicContextActionEnum.INTERACTED_WITH // Not yet used in this repo
  | HeuristicContextActionEnum.CALLED // Not yet used in this repo
  | HeuristicContextActionEnum.SENT_MESSAGE
  | HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION;

export const HeuristicPrefix = 'HEURISTIC' as const;

export enum HeuristicContextActionEnum {
  BOUGHT = 'BOUGHT',
  BRIDGED = 'BRIDGED',
  DEPLOYED = 'DEPLOYED',
  MINTED = 'MINTED',
  SWAPPED = 'SWAPPED',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  COMMITTED_TO = 'COMMITTED_TO', // Not yet used in this repo
  RECEIVED_AIRDROP = 'RECEIVED_AIRDROP',
  GAVE_ACCESS = 'GAVE_ACCESS',
  REVOKED_ACCESS = 'REVOKED_ACCESS',
  INTERACTED_WITH = 'INTERACTED_WITH', // Not yet used in this repo
  CALLED = 'CALLED', // Not yet used in this repo
  SENT_MESSAGE = 'SENT_MESSAGE',
  CANCELED_A_PENDING_TRANSACTION = 'CANCELED_A_PENDING_TRANSACTION',
}

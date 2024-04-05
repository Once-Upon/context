export type HeuristicContextAction =
  | HeuristicContextActionEnum.BOUGHT
  | HeuristicContextActionEnum.BRIDGED
  | HeuristicContextActionEnum.DEPLOYED
  | HeuristicContextActionEnum.MINTED
  | HeuristicContextActionEnum.SWAPPED
  | HeuristicContextActionEnum.SENT
  | HeuristicContextActionEnum.RECEIVED
  | HeuristicContextActionEnum.COMMITTED_TO
  | HeuristicContextActionEnum.RECEIVED_AIRDROP
  | HeuristicContextActionEnum.GAVE_ACCESS
  | HeuristicContextActionEnum.REVOKED_ACCESS
  | HeuristicContextActionEnum.INTERACTED_WITH
  | HeuristicContextActionEnum.CALLED
  | HeuristicContextActionEnum.SENT_MESSAGE
  | HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION;

export enum HeuristicContextActionEnum {
  BOUGHT = 'BOUGHT',
  BRIDGED = 'BRIDGED',
  DEPLOYED = 'DEPLOYED',
  MINTED = 'MINTED',
  SWAPPED = 'SWAPPED',
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  COMMITTED_TO = 'COMMITTED_TO',
  RECEIVED_AIRDROP = 'RECEIVED_AIRDROP',
  GAVE_ACCESS = 'GAVE_ACCESS',
  REVOKED_ACCESS = 'REVOKED_ACCESS',
  INTERACTED_WITH = 'INTERACTED_WITH',
  CALLED = 'CALLED',
  SENT_MESSAGE = 'SENT_MESSAGE',
  CANCELED_A_PENDING_TRANSACTION = 'CANCELED_A_PENDING_TRANSACTION',
}

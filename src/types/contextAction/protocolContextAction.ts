export type WETHContextAction = 'WRAPPED' | 'UNWRAPPED';

export type ENSContextAction = 'REGISTERED' | 'RENEWED' | 'SET_REVERSE_ENS_TO';

export type CryptoPunksContextAction =
  | 'MINTED_PUNK'
  | 'LISTED_PUNK'
  | 'WITHDREW_BID_FOR'
  | 'BID_ON_PUNK'
  | 'WITHDREW_FROM_CONTRACT'
  | 'BOUGHT_PUNK'
  | 'TRANSFERRED_PUNK'
  | 'UNLISTED_PUNK';

export type LeeroyContextAction =
  | 'TIPPED'
  | 'UPDATED_USER_DETAILS'
  | 'REPLIED_TO'
  | 'REPOSTED'
  | 'REGISTERED_USERNAME'
  | 'FOLLOWED'
  | 'UNFOLLOWED'
  | 'POSTED';

export type FrenpetContextAction =
  | 'SET_PET_NAME'
  | 'BOUGHT_ACCESSORY'
  | 'ATTACKED'
  | 'REDEEMED'
  | 'COMMITTED_TO_ATTACKING'
  | 'TOO_SLOW_TO_ATTACK'
  | 'WHEEL_REVEALED'
  | 'WHEEL_COMMITTED'
  | 'KILLED'
  | 'MINTED'
  | 'REDEEMED'
  | 'SOLD_ITEM'
  | 'JOINED_DICE_GAME'
  | 'DICE_GAME_SETTLED';

export type FarcasterContextAction =
  | 'REGISTERED_FARCASTER_ID'
  | 'CHANGED_RECOVERY_ADDRESS'
  | 'TRANSFERRED_FARCASTER_ID'
  | 'RENTED'
  | 'REMOVED_A_KEY'
  | 'ADDED_A_KEY';

export type EASContextAction =
  | 'ATTESTED'
  | 'REVOKED'
  | 'TIMESTAMPED'
  | 'REGISTERED';

export type FriendTechContextAction =
  | 'FAILED_TO_BUY_KEYS'
  | 'BOUGHT_KEYS'
  | 'SOLD_KEYS'
  | 'SIGNED_UP';

export type NounsAuctionHouseAction = 'BID' | 'SETTLED';

export type NounsGovernorAction =
  | 'CREATED_PROPOSAL'
  | 'VOTED_FOR'
  | 'VOTED_AGAINST'
  | 'ABSTAINED'
  | 'QUEUED'
  | 'EXECUTED'
  | 'CANCELED'
  | 'VETOED';

export type UniswapV2RouterAction = 'ADDED_LIQUIDITY' | 'SWAP';

export type ClaimCampaignsAction = 'CLAIMED';

export type BasepaintAction = 'PAINTED' | 'WITHDREW_REWARDS';

export type DisperseAction = 'TIPPED';

export type BNSContextAction =
  | 'REGISTERED'
  | 'RENEWED'
  | 'SET_REVERSE_BNS_TO'
  | 'UPDATED_TEXT'
  | 'UPDATED_ADDRESS'
  | 'UPDATED_CONTENTHASH'
  | 'UPDATED_RECORDS'
  | 'TRANSFERED_NAME'
  | 'TRANSFERED_NAMES';

export type ProtocolContextAction =
  | WETHContextAction
  | ENSContextAction
  | CryptoPunksContextAction
  | LeeroyContextAction
  | FrenpetContextAction
  | FarcasterContextAction
  | EASContextAction
  | FriendTechContextAction
  | NounsAuctionHouseAction
  | NounsGovernorAction
  | UniswapV2RouterAction
  | ClaimCampaignsAction
  | BasepaintAction
  | DisperseAction
  | BNSContextAction;

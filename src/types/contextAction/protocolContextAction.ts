export enum WETHContextActionEnum {
  WRAPPED = 'WRAPPED',
  UNWRAPPED = 'UNWRAPPED',
}

// TODO: See if this syntax would work instead to be easier to maintain and less verbose
// export type WETHContextAction = WETHContextActionEnum;

export type WETHContextAction =
  | WETHContextActionEnum.WRAPPED
  | WETHContextActionEnum.UNWRAPPED;

export enum ENSContextActionEnum {
  REGISTERED = 'REGISTERED',
  RENEWED = 'RENEWED',
  SET_REVERSE_ENS_TO = 'SET_REVERSE_ENS_TO',
}

export type ENSContextAction =
  | ENSContextActionEnum.REGISTERED
  | ENSContextActionEnum.RENEWED
  | ENSContextActionEnum.SET_REVERSE_ENS_TO;

export enum CryptoPunksContextActionEnum {
  MINTED_PUNK = 'MINTED_PUNK',
  LISTED_PUNK = 'LISTED_PUNK',
  WITHDREW_BID_FOR = 'WITHDREW_BID_FOR',
  BID_ON_PUNK = 'BID_ON_PUNK',
  WITHDREW_FROM_CONTRACT = 'WITHDREW_FROM_CONTRACT',
  BOUGHT_PUNK = 'BOUGHT_PUNK',
  TRANSFERRED_PUNK = 'TRANSFERRED_PUNK',
  UNLISTED_PUNK = 'UNLISTED_PUNK',
}

export type CryptoPunksContextAction =
  | CryptoPunksContextActionEnum.MINTED_PUNK
  | CryptoPunksContextActionEnum.LISTED_PUNK
  | CryptoPunksContextActionEnum.WITHDREW_BID_FOR
  | CryptoPunksContextActionEnum.BID_ON_PUNK
  | CryptoPunksContextActionEnum.WITHDREW_FROM_CONTRACT
  | CryptoPunksContextActionEnum.BOUGHT_PUNK
  | CryptoPunksContextActionEnum.TRANSFERRED_PUNK
  | CryptoPunksContextActionEnum.UNLISTED_PUNK;

export enum LeeroyContextActionEnum {
  TIPPED = 'TIPPED',
  UPDATED_USER_DETAILS = 'UPDATED_USER_DETAILS',
  REPLIED_TO = 'REPLIED_TO',
  REPOSTED = 'REPOSTED',
  REGISTERED_USERNAME = 'REGISTERED_USERNAME',
  FOLLOWED = 'FOLLOWED',
  UNFOLLOWED = 'UNFOLLOWED',
  POSTED = 'POSTED',
}

export type LeeroyContextAction =
  | LeeroyContextActionEnum.TIPPED
  | LeeroyContextActionEnum.UPDATED_USER_DETAILS
  | LeeroyContextActionEnum.REPLIED_TO
  | LeeroyContextActionEnum.REPOSTED
  | LeeroyContextActionEnum.REGISTERED_USERNAME
  | LeeroyContextActionEnum.FOLLOWED
  | LeeroyContextActionEnum.UNFOLLOWED
  | LeeroyContextActionEnum.POSTED;

export enum FrenpetContextActionEnum {
  SET_PET_NAME = 'SET_PET_NAME',
  BOUGHT_ACCESSORY = 'BOUGHT_ACCESSORY',
  ATTACKED = 'ATTACKED',
  REDEEMED = 'REDEEMED',
  COMMITTED_TO_ATTACKING = 'COMMITTED_TO_ATTACKING',
  TOO_SLOW_TO_ATTACK = 'TOO_SLOW_TO_ATTACK',
  WHEEL_REVEALED = 'WHEEL_REVEALED',
  WHEEL_COMMITTED = 'WHEEL_COMMITTED',
  KILLED = 'KILLED',
  MINTED = 'MINTED',
  SOLD_ITEM = 'SOLD_ITEM', // Not used
  JOINED_DICE_GAME = 'JOINED_DICE_GAME', // Not used
  DICE_GAME_SETTLED = 'DICE_GAME_SETTLED', // Not used
}

export type FrenpetContextAction =
  | FrenpetContextActionEnum.SET_PET_NAME
  | FrenpetContextActionEnum.BOUGHT_ACCESSORY
  | FrenpetContextActionEnum.ATTACKED
  | FrenpetContextActionEnum.REDEEMED
  | FrenpetContextActionEnum.COMMITTED_TO_ATTACKING
  | FrenpetContextActionEnum.TOO_SLOW_TO_ATTACK
  | FrenpetContextActionEnum.WHEEL_REVEALED
  | FrenpetContextActionEnum.WHEEL_COMMITTED
  | FrenpetContextActionEnum.KILLED
  | FrenpetContextActionEnum.MINTED
  | FrenpetContextActionEnum.SOLD_ITEM
  | FrenpetContextActionEnum.JOINED_DICE_GAME
  | FrenpetContextActionEnum.DICE_GAME_SETTLED;

export enum FarcasterContextActionEnum {
  REGISTERED_FARCASTER_ID = 'REGISTERED_FARCASTER_ID',
  CHANGED_RECOVERY_ADDRESS = 'CHANGED_RECOVERY_ADDRESS',
  TRANSFERRED_FARCASTER_ID = 'TRANSFERRED_FARCASTER_ID',
  RENTED = 'RENTED',
  REMOVED_A_KEY = 'REMOVED_A_KEY',
  ADDED_A_KEY = 'ADDED_A_KEY',
}

export type FarcasterContextAction =
  | FarcasterContextActionEnum.REGISTERED_FARCASTER_ID
  | FarcasterContextActionEnum.CHANGED_RECOVERY_ADDRESS
  | FarcasterContextActionEnum.TRANSFERRED_FARCASTER_ID
  | FarcasterContextActionEnum.RENTED
  | FarcasterContextActionEnum.REMOVED_A_KEY
  | FarcasterContextActionEnum.ADDED_A_KEY;

export enum EASContextActionEnum {
  ATTESTED = 'ATTESTED',
  REVOKED = 'REVOKED',
  TIMESTAMPED = 'TIMESTAMPED',
  REGISTERED = 'REGISTERED',
}

export type EASContextAction =
  | EASContextActionEnum.ATTESTED
  | EASContextActionEnum.REVOKED
  | EASContextActionEnum.TIMESTAMPED
  | EASContextActionEnum.REGISTERED;

export enum FriendTechContextActionEnum {
  FAILED_TO_BUY_KEYS = 'FAILED_TO_BUY_KEYS',
  BOUGHT_KEYS = 'BOUGHT_KEYS',
  SOLD_KEYS = 'SOLD_KEYS',
  SIGNED_UP = 'SIGNED_UP',
}

export type FriendTechContextAction =
  | FriendTechContextActionEnum.FAILED_TO_BUY_KEYS
  | FriendTechContextActionEnum.BOUGHT_KEYS
  | FriendTechContextActionEnum.SOLD_KEYS
  | FriendTechContextActionEnum.SIGNED_UP;

export enum NounsAuctionHouseActionEnum {
  BID = 'BID',
  SETTLED = 'SETTLED',
}

export type NounsAuctionHouseAction =
  | NounsAuctionHouseActionEnum.BID
  | NounsAuctionHouseActionEnum.SETTLED;

export enum NounsGovernorActionEnum {
  CREATED_PROPOSAL = 'CREATED_PROPOSAL',
  VOTED_FOR = 'VOTED_FOR',
  VOTED_AGAINST = 'VOTED_AGAINST',
  ABSTAINED = 'ABSTAINED',
  QUEUED = 'QUEUED',
  EXECUTED = 'EXECUTED',
  CANCELED = 'CANCELED',
  VETOED = 'VETOED',
}

export type NounsGovernorAction =
  | NounsGovernorActionEnum.CREATED_PROPOSAL
  | NounsGovernorActionEnum.VOTED_FOR
  | NounsGovernorActionEnum.VOTED_AGAINST
  | NounsGovernorActionEnum.ABSTAINED
  | NounsGovernorActionEnum.QUEUED
  | NounsGovernorActionEnum.EXECUTED
  | NounsGovernorActionEnum.CANCELED
  | NounsGovernorActionEnum.VETOED;

export enum UniswapV2RouterActionEnum {
  ADDED_LIQUIDITY = 'ADDED_LIQUIDITY',
}

export type UniswapV2RouterAction = UniswapV2RouterActionEnum.ADDED_LIQUIDITY;

export enum ClaimCampaignsActionEnum {
  CLAIMED = 'CLAIMED',
}
export type ClaimCampaignsAction = ClaimCampaignsActionEnum.CLAIMED;

export enum BasepaintActionEnum {
  PAINTED = 'PAINTED',
  WITHDREW_REWARDS = 'WITHDREW_REWARDS',
}

export type BasepaintAction =
  | BasepaintActionEnum.PAINTED
  | BasepaintActionEnum.WITHDREW_REWARDS;

export enum DisperseActionEnum {
  TIPPED = 'TIPPED', // TODO: Decide if we want a different word for this than with Leeroy?
}

export type DisperseAction = DisperseActionEnum.TIPPED;

export enum BNSContextActionEnum {
  REGISTERED = 'REGISTERED',
  RENEWED = 'RENEWED',
  SET_REVERSE_BNS_TO = 'SET_REVERSE_BNS_TO',
  UPDATED_TEXT = 'UPDATED_TEXT',
  UPDATED_ADDRESS = 'UPDATED_ADDRESS',
  UPDATED_CONTENTHASH = 'UPDATED_CONTENTHASH',
  UPDATED_RECORDS = 'UPDATED_RECORDS',
  TRANSFERED_NAME = 'TRANSFERED_NAME',
  TRANSFERED_NAMES = 'TRANSFERED_NAMES',
}

export type BNSContextAction =
  | BNSContextActionEnum.REGISTERED
  | BNSContextActionEnum.RENEWED
  | BNSContextActionEnum.SET_REVERSE_BNS_TO
  | BNSContextActionEnum.UPDATED_TEXT
  | BNSContextActionEnum.UPDATED_ADDRESS
  | BNSContextActionEnum.UPDATED_CONTENTHASH
  | BNSContextActionEnum.UPDATED_RECORDS
  | BNSContextActionEnum.TRANSFERED_NAME
  | BNSContextActionEnum.TRANSFERED_NAMES;

export enum BoomboxContextActionEnum {
  ADDED = 'ADDED',
  SIGNED = 'SIGNED',
  DISTRIBUTED = 'DISTRIBUTED',
}

export type BoomboxContextAction =
  | BoomboxContextActionEnum.ADDED
  | BoomboxContextActionEnum.SIGNED
  | BoomboxContextActionEnum.DISTRIBUTED;

export enum Protocols {
  WETH = 'WETH',
  ENS = 'ENS',
  CRYPTOPUNKS = 'CRYPTOPUNKS',
  LEEROY = 'LEEROY',
  FRENPET = 'FRENPET',
  FARCASTER = 'FARCASTER',
  EAS = 'EAS',
  FRIENDTECH = 'FRIENDTECH',
  NOUNS_AUCTION_HOUSE = 'NOUNS_AUCTION_HOUSE',
  NOUNS_GOVERNOR = 'NOUNS_GOVERNOR',
  UNISWAP_V2_ROUTER = 'UNISWAP_V2_ROUTER',
  CLAIM_CAMPAIGNS = 'CLAIM_CAMPAIGNS',
  BASEPAINT = 'BASEPAINT',
  DISPERSE = 'DISPERSE',
  BNS = 'BNS',
  BOOMBOX = 'BOOMBOX',
}

// Function to merge enums into a single object
function mergeEnums(...enums: any[]): { [key: string]: string } {
  const result: { [key: string]: string } = {};
  enums.forEach((enumObj) => {
    Object.keys(enumObj).forEach((key) => {
      result[key] = enumObj[key];
    });
  });
  return result;
}

export const ProtocolContextActionEnum = mergeEnums(
  WETHContextActionEnum,
  ENSContextActionEnum,
  CryptoPunksContextActionEnum,
  LeeroyContextActionEnum,
  FrenpetContextActionEnum,
  FarcasterContextActionEnum,
  EASContextActionEnum,
  FriendTechContextActionEnum,
  NounsAuctionHouseActionEnum,
  NounsGovernorActionEnum,
  UniswapV2RouterActionEnum,
  ClaimCampaignsActionEnum,
  BasepaintActionEnum,
  DisperseActionEnum,
  BNSContextActionEnum,
  BoomboxContextActionEnum,
);

export type ProtocolContextAction =
  (typeof ProtocolContextActionEnum)[keyof typeof ProtocolContextActionEnum];

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

// Foundation
export type FoundationOriginalMarketContextAction =
  | 'PLACED_BID' // reserve auction
  | 'CREATED_RESERVE_AUCTION' // reserve auction
  | 'FINALIZED_RESERVE_AUCTION' // reserve auction
  | 'SET_BUY_PRICE' // buy now
  | 'ACCEPTED_BUY_PRICE' // buy now
  | 'MADE_OFFER' // offers
  | 'ACCEPTED_OFFER' // offers
  | 'UNLISTED'; // both reserve auction and buy now

// TODO: Add drop reveal
export type FoundationDropMarketContextAction =
  | 'CREATED_FIXED_PRICE_SALE'
  | 'CREATED_FIXED_PRICE_SALE_WITH_ALLOWLIST'
  | 'MINTED_FROM_FIXED_PRICE_SALE_WITH_ALLOWLIST';

export type FoundationWorldsContextAction =
  | 'ACCEPTED_TRANSFER'
  | 'BEGAN_TRANSFER'
  | 'SET_PAYMENT_ADDRESS'
  | 'ADDED_TO_WORLD_BY_SPLIT'
  | 'MIGRATED_FROM_EXHIBITION'
  | 'REMOVED_FROM_ALLOWLIST_BY_SELLER';

export type ProtocolContextAction =
  | WETHContextAction
  | ENSContextAction
  | CryptoPunksContextAction
  | LeeroyContextAction
  | FrenpetContextAction
  | FarcasterContextAction
  | FoundationOriginalMarketContextAction;

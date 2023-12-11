export type WETHContextAction = 'wrapped' | 'unwrapped';

export type ENSContextAction = 'registered' | 'renewed' | 'set reverse ens to';

export type CryptoPunksContextAction =
  | 'minted punk'
  | 'listed punk'
  | 'withdrew bid for'
  | 'bid on punk'
  | 'withdrew from contract'
  | 'bought punk'
  | 'transferred punk'
  | 'unlisted punk';

export type LeeroyContextAction =
  | 'tipped'
  | 'updated user details'
  | 'replied to'
  | 'reposted'
  | 'registered username'
  | 'followed'
  | 'unfollowed'
  | 'posted';

export type FrenpetContextAction =
  | 'set pet name'
  | 'bought accessory'
  | 'attacked'
  | 'redeemed'
  | 'committed to attacking'
  | 'too slow to attack'
  | 'wheel revealed'
  | 'wheel committed'
  | 'killed'
  | 'minted'
  | 'redeemed'
  | 'sold item'
  | 'joined dice game'
  | 'dice game settled';

export type FarcasterContextAction =
  | 'registered Farcaster ID'
  | 'changed recovery address'
  | 'transferred Farcaster ID'
  | 'rented'
  | 'removed a key'
  | 'added a key';

export type ProtocolContextAction =
  | WETHContextAction
  | ENSContextAction
  | CryptoPunksContextAction
  | LeeroyContextAction
  | FrenpetContextAction
  | FarcasterContextAction;

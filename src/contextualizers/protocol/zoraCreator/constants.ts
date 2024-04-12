import zoraCreatorAbi from './abis/ZoraCreator';
import protocolRewardsAbi from './abis/ProtocolRewards';

export const PROTOCOL_REWARDS_CONTRACT =
  '0x7777777f279eba3d3ad8f4e708545291a6fdba8b';

// RewardsDeposit(address indexed creator, address indexed createReferral, address indexed mintReferral, address firstMinter, address zora, address from, uint256 creatorReward, uint256 createReferralReward, uint256 mintReferralReward, uint256 firstMinterReward, uint256 zoraReward)
export const REWARDS_DEPOSIT_TOPIC =
  '0x90e8cce6b15b450d1e56e9ef986d1cd376838a90944336c02886ca12b9e6ebd7';

export const ZORA_CREATOR_ABI = zoraCreatorAbi;
export const PROTOCOL_REWARDS_ABI = protocolRewardsAbi;

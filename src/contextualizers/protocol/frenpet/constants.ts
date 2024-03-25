export const contracts = {
  frenPetGameplayContractV1: '0x0e22b5f3e11944578b37ed04f5312dfc246f443c',
  frenPetERC20TokenContract: '0xff0c532fdb8cd566ae169c1cb157ff2bdc83e105',
  frenPetNFTTokenContract: '0x5b51cf49cb48617084ef35e7c7d7a21914769ff1',
};

export const abiMapping = {
  buyAccessoryFunction: 'function buyAccessory(uint256,uint256)',
  attackFunction: 'function attack(uint256,uint256)',
  bonkRevealFunction: 'function bonkReveal(uint256,bytes32)',
  bonkCommitFunction:
    'function bonkCommit(uint256,uint256,bytes32,bytes32,bytes)',
  killFunction: 'function kill(uint256,uint256)',
  setPetNameFunction: 'function setPetName(uint256,string)',
  wheelCommitFunction: 'function wheelCommit(uint256,uint256,bytes32,bytes)',
  wheelRevealFunction: 'function wheelReveal(uint256,bytes32)',
  redeemFunction: 'function redeem(uint256)',
  attackEvent:
    'event Attack(uint256 attacker, uint256 winner, uint256 loser, uint256 scoresWon)',
  bonkTooSlowEvent: 'event BonkTooSlow(uint256,uint256)',
  sellItemEvent: 'event SellItem(uint256,address,uint256)',
  redeemRewardsEvent: 'event RedeemRewards(uint256 indexed, uint256)',
};

export const frenPetItemsMapping = {
  0: '1 🍄',
  1: '1 🍎',
  2: '1 🎣',
  3: '1 🛀',
  4: '1 ☕️',
  5: '1 🍻',
  6: '1 🛡️',
  7: 'insurance',
  8: 'midnight meow',
  9: 'Pixel Pal',
  10: 'Bunny Buddy',
  11: 'Fortune Feline Mask',
  12: 'Baby Yoda Mask',
  13: 'Psychedelic Bunny Mask',
  14: 'Thuglife Shades',
  15: 'Panda Peepers',
  16: 'Laser Lenses',
  17: 'Twintail Tango Wig',
  18: 'J-Punk Wig',
  19: 'Bear Buddy Beanie',
  20: 'Jade Panda Pal',
  21: 'Koi Fish',
};

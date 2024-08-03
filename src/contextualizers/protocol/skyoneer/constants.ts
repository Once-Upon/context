import packActivationDestinationAbi from './abis/PackActivationDestination';
import packActivationSourceAbi from './abis/PackActivationSource';
import plotActionAbi from './abis/PlotAction';
import gameEngineAbi from './abis/GameEngine';

export const PACK_ACTIVATION_DESTINATION_CONTRACT =
  '0x21170f8bd35d0afa8ad55719ce29d6489a8585db';
export const PACK_ACTIVATION_SOURCE_CONTRACT =
  '0xde1bc6e9164af5a48c45111b811c61f11ce58d91';
export const PLOT_ERC721_CONTRACT =
  '0xe2f275b2a5c376fd10006b67a9be0cc3bd5488e8';
export const Z_GOLD_CONTRACT_ADDRESS =
  '0x387d73bd8682dceb3327b940213d5de50ee2bba2';
export const PLOT_ACTION_CONTRACT_ADDRESS =
  '0xb45805566a842efb6329c11e092158f3e0eddaa2';
export const GAME_ENGINE_CONTRACT_ADDRESS =
  '0xc1e5e0dc7e94f9167ccf983ba26f7c21c83e0a33';

export const PACK_ACTIVATION_SOURCE_ABI = packActivationSourceAbi;
export const PACK_ACTIVATION_DESTINATION_ABI = packActivationDestinationAbi;
export const PLOT_ACTION_ABI = plotActionAbi;
export const GAME_ENGINE_ABI = gameEngineAbi;

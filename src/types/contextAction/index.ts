import { HeuristicContextAction } from './heuristicContextAction';
import { ProtocolContextAction } from './protocolContextAction';
import { BridgeContextAction } from './bridgeContextACtion';

export type ContextAction =
  | HeuristicContextAction
  | ProtocolContextAction
  | BridgeContextAction;

export * from './heuristicContextAction';
export * from './protocolContextAction';
export * from './bridgeContextACtion';

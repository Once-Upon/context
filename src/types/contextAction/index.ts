import { HeuristicContextAction } from './heuristicContextAction';
import { ProtocolContextAction } from './protocolContextAction';
import { BridgeContextAction } from './bridge';

export type ContextAction =
  | HeuristicContextAction
  | ProtocolContextAction
  | BridgeContextAction;

export * from './heuristicContextAction';
export * from './protocolContextAction';
export * from './bridge';

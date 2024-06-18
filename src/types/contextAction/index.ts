import { HeuristicContextAction } from './heuristicContextAction';
import { ProtocolContextAction, Protocols } from './protocolContextAction';
import { BridgeContextAction } from './bridge';

export type ContextAction =
  | HeuristicContextAction
  | ProtocolContextAction
  | BridgeContextAction;

export type ContextActionFull =
  | `${Protocols}.${ProtocolContextAction}`
  | HeuristicContextAction
  | BridgeContextAction;

export * from './heuristicContextAction';
export * from './protocolContextAction';
export * from './bridge';

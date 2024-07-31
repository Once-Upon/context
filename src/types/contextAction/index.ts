import {
  HeuristicContextAction,
  HeuristicPrefix,
} from './heuristicContextAction';
import { ProtocolContextAction, Protocols } from './protocolContextAction';
import { BridgeContextAction } from './bridge';

export type ContextAction =
  | HeuristicContextAction
  | ProtocolContextAction
  | BridgeContextAction;

export type ContextActionID =
  | `${Protocols}.${ProtocolContextAction}`
  | `${typeof HeuristicPrefix}.${HeuristicContextAction | BridgeContextAction}`
  | HeuristicContextAction
  | BridgeContextAction;

export * from './heuristicContextAction';
export * from './protocolContextAction';
export * from './bridge';

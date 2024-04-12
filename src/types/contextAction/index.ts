import { HeuristicContextAction } from './heuristicContextAction';
import { ProtocolContextAction } from './protocolContextAction';

export type ContextAction = HeuristicContextAction | ProtocolContextAction;

export * from './heuristicContextAction';
export * from './protocolContextAction';

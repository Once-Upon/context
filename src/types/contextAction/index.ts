import { HeuristicContextAction } from './heuristicContextAction';
import { ProtocolContextAction } from './protocolContextAction';

export type ContextAction = HeuristicContextAction | ProtocolContextAction | 'CALLED';

import { decodeLog, decodeTransactionInput } from '../../../helpers/utils';
import { CHAIN_IDS } from '../../../helpers/constants';
import {
  Transaction,
  EventLogTopics,
  GoldContextActionEnum,
} from '../../../types';
import {
  PACK_ACTIVATION_DESTINATION_ABI,
  PACK_ACTIVATION_DESTINATION_CONTRACT,
} from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isPackActivationDestination = detect(transaction);
  if (!isPackActivationDestination) return transaction;

  const result = generate(transaction);
  return result;
}

// Always chain id 1 through the Zora bridge UI
export function detect(transaction: Transaction): boolean {
  if (
    transaction.from !== PACK_ACTIVATION_DESTINATION_CONTRACT ||
    transaction.chainId !== CHAIN_IDS.gold
  ) {
    return false;
  }
  // check logs
  if (!transaction.logs) return false;
  const activatedStarterPackOnDestinationEvent = transaction.logs.find(
    (log) => {
      const decoded = decodeLog(PACK_ACTIVATION_DESTINATION_ABI, log.data, [
        log.topic0,
        log.topic1,
        log.topic2,
        log.topic3,
      ] as EventLogTopics);

      if (
        decoded &&
        decoded.eventName === 'ActivatedStarterPackOnDestination'
      ) {
        return true;
      }

      return false;
    },
  );

  if (activatedStarterPackOnDestinationEvent) return true;

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (
    transaction.to !== PACK_ACTIVATION_DESTINATION_CONTRACT ||
    !transaction.logs ||
    transaction.chainId !== CHAIN_IDS.gold
  )
    return transaction;

  // decode input
  const decodedInput = decodeTransactionInput(
    transaction.input,
    PACK_ACTIVATION_DESTINATION_ABI,
  );
  if (!decodedInput || decodedInput.functionName == 'activateDestination') {
    return transaction;
  }
  // decode ActivatedStarterPackOnDestination event
  let activatedStarterPackOnDestinationDecoded, mintedPlotPackActivateDecoded;
  const gameMintedTokenDecoded: any[] = [];
  for (const log of transaction.logs) {
    const decoded = decodeLog(PACK_ACTIVATION_DESTINATION_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);
    if (!decoded) continue;

    switch (decoded.eventName) {
      case 'ActivatedStarterPackOnDestination':
        activatedStarterPackOnDestinationDecoded = decoded;
        break;
      case 'MintedPlotPackActivate':
        mintedPlotPackActivateDecoded = decoded;
        break;
      case 'GameMintedToken':
        gameMintedTokenDecoded.push(decoded);
        break;
      default:
        break;
    }
  }
  if (
    !activatedStarterPackOnDestinationDecoded ||
    !mintedPlotPackActivateDecoded ||
    gameMintedTokenDecoded.length !== 2
  )
    return transaction;

  // grab variables from decoded event
  const cropName = decodedInput.args[2];
  const plots = activatedStarterPackOnDestinationDecoded.args['plots'];
  const zGoldAmount = BigInt(
    mintedPlotPackActivateDecoded[0].args['amount'],
  ).toString();
  const cropAmount = BigInt(
    mintedPlotPackActivateDecoded[1].args['amount'],
  ).toString();
  const activator = activatedStarterPackOnDestinationDecoded.args['activator'];

  transaction.context = {
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: `Gold`,
        default:
          '[[activator]][[received]]plots[[plots]][[cropAmount]]amount of[[cropName]]and[[zGoldAmount]]amount of Sky Gold',
      },
    },
    variables: {
      activator: {
        type: 'address',
        value: activator,
      },
      plots: {
        type: 'array',
        value: plots,
      },
      cropName: {
        type: 'string',
        value: cropName,
      },
      cropAmount: {
        type: 'string',
        value: cropAmount,
      },
      zGoldAmount: {
        type: 'string',
        value: zGoldAmount,
      },
      received: {
        type: 'contextAction',
        value: GoldContextActionEnum.RECEIVED,
      },
    },
  };

  return transaction;
}

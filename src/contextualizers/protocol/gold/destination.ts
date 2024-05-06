import { decodeLog, decodeTransactionInput } from '../../../helpers/utils';
import { CHAIN_IDS } from '../../../helpers/constants';
import {
  Transaction,
  EventLogTopics,
  GoldContextActionEnum,
  AssetType,
  ContextNumberType,
} from '../../../types';
import {
  PACK_ACTIVATION_DESTINATION_ABI,
  PACK_ACTIVATION_DESTINATION_CONTRACT,
  PLOT_ERC721_CONTRACT,
} from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isPackActivationDestination = detect(transaction);
  if (!isPackActivationDestination) return transaction;

  const result = generate(transaction);
  return result;
}

// Always chain id 1 through the Zora bridge UI
export function detect(transaction: Transaction): boolean {
  if (transaction.chainId !== CHAIN_IDS.gold) {
    return false;
  }
  // check logs
  if (!transaction.logs) return false;

  for (const log of transaction.logs) {
    if (log.address !== PACK_ACTIVATION_DESTINATION_CONTRACT) continue;

    const decoded = decodeLog(PACK_ACTIVATION_DESTINATION_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'ActivatedStarterPackOnDestination') {
      return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.logs || transaction.chainId !== CHAIN_IDS.gold)
    return transaction;

  // decode input
  const decodedInput = decodeTransactionInput(
    transaction.input,
    PACK_ACTIVATION_DESTINATION_ABI,
  );
  if (!decodedInput || decodedInput.functionName != 'activateDestination') {
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
  // const cropName = decodedInput.args[2];
  const plotIds = activatedStarterPackOnDestinationDecoded.args['plotIds'];
  const zGoldAmount = BigInt(
    gameMintedTokenDecoded[0].args['amount'],
  ).toString();
  const cropAmount = BigInt(
    gameMintedTokenDecoded[1].args['amount'],
  ).toString();
  const zGoldGameAddress = gameMintedTokenDecoded[0].args['gameAddress'];
  const cropGameAddress = gameMintedTokenDecoded[1].args['gameAddress'];
  const activator = activatedStarterPackOnDestinationDecoded.args['activator'];

  const erc721PlotArray =
    plotIds.length > 0
      ? plotIds.map((c: bigint) => {
          return {
            type: AssetType.ERC721,
            token: PLOT_ERC721_CONTRACT, // Future improvement: Get the address of the contract that emitted the mintedPlotPackActivateDecoded event
            tokenId: c.toString(),
          };
        })
      : [];

  const erc721ManyPlotsVariable: ContextNumberType = {
    type: 'number',
    unit: plotIds.length > 1 ? 'plots' : 'plot',
    value: plotIds.length,
  };

  transaction.context = {
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: `Gold`,
        default:
          plotIds?.length === 2
            ? '[[activator]][[received]]plots[[plotId0]]and[[plotId1]]and[[crop]]and[[zGold]]'
            : '[[activator]][[received]][[plots]]and[[crop]]and[[zGold]]',
      },
    },
    variables: {
      activator: {
        type: 'address',
        value: activator,
      },
      crop: {
        type: AssetType.ERC20,
        token: cropGameAddress,
        value: cropAmount,
      },
      zGold: {
        type: AssetType.ERC20,
        token: zGoldGameAddress,
        value: zGoldAmount,
      },
      received: {
        type: 'contextAction',
        value: GoldContextActionEnum.RECEIVED,
      },
    },
  };

  if (transaction && transaction.context && transaction.context.variables) {
    if (erc721PlotArray?.length === 2) {
      transaction.context.variables.plotId0 = erc721PlotArray[0];
      transaction.context.variables.plotId1 = erc721PlotArray[1];
    } else {
      transaction.context.variables.plots = erc721ManyPlotsVariable;
    }
  }

  return transaction;
}

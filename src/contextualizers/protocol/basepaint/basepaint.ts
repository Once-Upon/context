import { Hex } from 'viem';
import {
  Asset,
  AssetType,
  BasepaintActionEnum,
  ContextVariable,
  ETHAsset,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { BASEPAINT_CONTRACT, BRUSHES_CONTRACT, ABIs } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBasepaint = detect(transaction);
  if (!isBasepaint) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== BASEPAINT_CONTRACT) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      ABIs.Basepaint,
    );

    if (!decoded) return false;

    if (
      decoded.functionName !== 'paint' &&
      decoded.functionName !== 'authorWithdraw'
    ) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (!transaction.to) return transaction;

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.Basepaint,
  );

  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'paint': {
      const [day, brushId, pixelData] = decoded.args;

      const pixels = pixelData.slice(2).length / 3;

      transaction.context = {
        variables: {
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.BASEPAINT}.${BasepaintActionEnum.PAINTED}`,
            value: BasepaintActionEnum.PAINTED,
          },
          subject: {
            type: 'address',
            value: transaction.from,
          },
          brush: {
            type: AssetType.ERC721,
            token: BRUSHES_CONTRACT,
            tokenId: brushId.toString(),
          },
          pixels: {
            type: 'number',
            value: pixels,
            emphasis: true,
          },
          day: {
            type: 'string',
            value: day.toString(),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.BASEPAINT],
            default:
              '[[subject]][[contextAction]][[pixels]]pixels to day[[day]]using[[brush]]',
          },
        },
      };

      return transaction;
    }

    case 'authorWithdraw': {
      const [days] = decoded.args;

      const assetsReceived = transaction.netAssetTransfers?.[transaction.from];

      const isETHAsset = (asset: Asset): asset is ETHAsset => {
        return asset.type === AssetType.ETH;
      };

      const value = assetsReceived?.received.find(isETHAsset)?.value ?? '0';

      const variables: ContextVariable = {
        contextAction: {
          type: 'contextAction',
          id: `${Protocols.BASEPAINT}.${BasepaintActionEnum.WITHDREW_REWARDS}`,
          value: BasepaintActionEnum.WITHDREW_REWARDS,
        },
        subject: {
          type: 'address',
          value: transaction.from,
        },
        amount: {
          type: AssetType.ETH,
          value,
          unit: 'wei',
        },
        days: {
          type: 'number',
          emphasis: true,
          value: days.length,
        },
      };

      if (!transaction.to) return transaction;

      transaction.context = {
        variables,
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.BASEPAINT],
            default: `[[subject]][[contextAction]]of[[amount]]for[[days]]day${
              days.length === 1 ? "'s" : "s'"
            } contributions`,
          },
        },
      };

      return transaction;
    }

    default: {
      return transaction;
    }
  }
};

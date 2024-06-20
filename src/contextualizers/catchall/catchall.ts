import {
  AssetType,
  ERC1155Asset,
  ERC20Asset,
  ERC721Asset,
  ETHAsset,
  HeuristicContextActionEnum,
  Transaction,
} from '../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isCatchall = detect(transaction);

  if (!isCatchall) return transaction;

  return generate(transaction);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function detect(_transaction: Transaction): boolean {
  // There's always at least some context we can add with this catchall contextualization
  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.to) return transaction;

  const functionNameOrSigHash =
    transaction?.decoded?.name || transaction?.sigHash;
  const functionName = transaction?.decoded?.name || '';

  transaction.context = {
    actions: [HeuristicContextActionEnum.INTERACTED_WITH],

    variables: {
      address: {
        type: 'address',
        value: transaction.from,
      },
      functionName: {
        type: 'string',
        value: functionName,
        emphasis: true,
      },
      toAddress: {
        type: 'address',
        value: transaction.to,
      },
      interactedWith: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.INTERACTED_WITH,
        value: HeuristicContextActionEnum.INTERACTED_WITH,
      },
      called: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.CALLED,
        value: HeuristicContextActionEnum.CALLED,
      },
    },

    summaries: {
      category: 'UNKNOWN',
      en: {
        title: functionNameOrSigHash !== '0x' ? functionNameOrSigHash : '--',
        default:
          functionName !== ''
            ? '[[address]][[called]][[functionName]]on[[toAddress]]'
            : '[[address]][[interactedWith]][[toAddress]]',
      },
    }
  };
  if (!transaction.netAssetTransfers) {
    return transaction;
  }

  const nftAssets = new Set();
  const tokenAssets = new Set();
  const tokenTransfers: ERC20Asset[] = [];
  const ethTransfers: ETHAsset[] = [];
  Object.keys(transaction.netAssetTransfers).forEach((address) => {
    const sentAssets = transaction.netAssetTransfers
      ? transaction.netAssetTransfers[address]?.sent
      : [];
    for (const assetTransfer of sentAssets) {
      switch (assetTransfer.type) {
        case 'erc1155':
        case 'erc721':
          nftAssets.add(assetTransfer.contract);
          break;
        case 'erc20':
          tokenAssets.add(assetTransfer.contract);
          tokenTransfers.push(assetTransfer);
          break;
        case 'eth':
          ethTransfers.push(assetTransfer);
          break;
        default:
          break;
      }
    }
  });

  let totalEthSent = BigInt('0');
  for (const address in transaction.netAssetTransfers) {
    const assetsSent = transaction.netAssetTransfers[address]?.sent;
    if (!assetsSent?.length) {
      continue;
    }

    totalEthSent = assetsSent
      .filter((assetTransfer) => assetTransfer.type === AssetType.ETH)
      .reduce((sum, ele) => {
        const ethTransfer = ele as ETHAsset;
        sum = sum + BigInt(ethTransfer.value);
        return sum;
      }, totalEthSent);
  }

  // Note: Not returning early in this block because we want to build the key/value pairs below
  if (
    nftAssets.size == 0 &&
    tokenAssets.size == 0 &&
    ethTransfers.length === 0
  ) {
    return transaction;
  }
  const nftAssetsCount =
    transaction.assetTransfers
      ?.filter(
        (assetTransfer) =>
          assetTransfer.type === AssetType.ERC721 ||
          assetTransfer.type === AssetType.ERC1155,
      )
      .reduce(
        (acc, ele) => ('value' in ele ? acc + parseInt(ele.value) : acc + 1),
        0,
      ) || 0;

  let assetAmount = 0;
  let variables = {};
  let desc = '';
  if (nftAssetsCount > 0) {
    const unit = nftAssetsCount > 1 ? 'NFTs' : 'NFT';
    assetAmount += nftAssetsCount;

    variables['totalNFTs'] = {
      type: 'number',
      value: nftAssetsCount,
      unit,
      emphasis: true,
    };
    desc += 'and[[totalNFTs]]';
  }
  if (tokenAssets.size > 0) {
    const unit = tokenAssets.size > 1 ? 'ERC20s' : 'ERC20';
    assetAmount += tokenAssets.size;

    variables['totalERC20s'] =
      tokenAssets.size > 1
        ? {
            type: 'number',
            value: tokenAssets.size,
            unit,
            emphasis: true,
          }
        : {
            type: AssetType.ERC20,
            token: tokenTransfers[0].contract,
            value: tokenTransfers[0].value,
          };
    desc += 'and[[totalERC20s]]';
  }
  if (ethTransfers.length > 0) {
    const ethValue = totalEthSent.toString();
    assetAmount++;

    variables['totalEth'] = {
      type: 'eth',
      value: ethValue,
      unit: 'wei',
    };
    desc += 'and[[totalEth]]';
  }

  // check if single erc20 or erc721/erc1155
  if (assetAmount === 0) {
    return transaction;
  } else if (assetAmount > 1) {
    desc += 'were transferred';
  } else if (assetAmount === 1 && ethTransfers.length >= 1) {
    // eth
    desc += 'was transferred';
  } else {
    let sender = '';
    let receiver = '';
    let assetTransfer: ERC1155Asset | ERC721Asset | ERC20Asset | undefined;
    const assetAddress = [...tokenAssets][0] || [...nftAssets][0];
    for (const address in transaction.netAssetTransfers) {
      const sent = transaction.netAssetTransfers[address]?.sent as (
        | ERC1155Asset
        | ERC721Asset
        | ERC20Asset
      )[];
      const received = transaction.netAssetTransfers[address]?.received as (
        | ERC1155Asset
        | ERC721Asset
        | ERC20Asset
      )[];
      const hasSentAsset = sent.find((ele) => ele.contract === assetAddress);
      if (hasSentAsset) {
        sender = address;
        assetTransfer = hasSentAsset;
      }

      const hasReceivedAsset = received.find(
        (ele) => ele.contract === assetAddress,
      );
      if (hasReceivedAsset) {
        assetTransfer = hasReceivedAsset;
        receiver = address;
      }
    }

    if (!assetTransfer) {
      return transaction;
    }

    desc = 'and[[asset]]was transferred from[[sender]]to[[receiver]]';
    variables = {
      asset:
        assetTransfer.type === AssetType.ERC20
          ? {
              type: AssetType.ERC20,
              token: assetTransfer.contract,
              value: assetTransfer.value,
            }
          : assetTransfer.type === AssetType.ERC721
          ? {
              type: AssetType.ERC721,
              tokenId: assetTransfer.tokenId,
              token: assetTransfer.contract,
            }
          : {
              type: AssetType.ERC1155,
              tokenId: assetTransfer.tokenId,
              token: assetTransfer.contract,
              value: assetTransfer.value,
            },
      sender: {
        type: 'address',
        value: sender,
      },
      receiver: {
        type: 'address',
        value: receiver,
      },
    };
  }

  if (transaction.context?.summaries) {
    transaction.context.summaries.en.default += desc;
    transaction.context.variables = {
      ...transaction.context.variables,
      ...variables,
    };
  }

  return transaction;
}

import {
  AssetType,
  ERC1155Asset,
  ERC721Asset,
  ETHAsset,
  HeuristicContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
  WarpcastContextActionEnum,
} from '../../../types';

const WARPCAST_MINT_ADDRESSES = [
  '0x2d93c2f74b2c4697f9ea85d0450148aa45d4d5a2',
  '0x855a4621d491ff98bc3d02eadbc108403887561c',
];

export function contextualize(transaction: Transaction): Transaction {
  const isBuyWarps = detect(transaction);

  if (!isBuyWarps) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // A mint with Warps originates from WARPCAST_MINT_ADDRESS on the Zora network calling mintWithRewards(address minter, uint256 tokenId, uint256 quantity, bytes minterArguments, address mintReferral)
  // 9dbb844d - mintWithRewards(address minter, uint256 tokenId, uint256 quantity, bytes minterArguments, address mintReferral)
  if (
    transaction.sigHash === '0x9dbb844d' &&
    WARPCAST_MINT_ADDRESSES.indexOf(transaction.from) > -1
  ) {
    console.log('here');
    for (let i = 0; i < WARPCAST_MINT_ADDRESSES.length; i++) {
      const warpcastMintAddress = WARPCAST_MINT_ADDRESSES[i];
      if (
        transaction.netAssetTransfers?.[warpcastMintAddress]?.sent?.length ===
          1 &&
        transaction.netAssetTransfers?.[warpcastMintAddress].sent[0].type ===
          'eth'
      )
        return true;
    }
  }
  return false;
}

export function generate(transaction: Transaction): Transaction {
  let receivingAddress: any;
  let minted: any;
  // Get the receiving address and what they minted
  for (const address in transaction.netAssetTransfers) {
    if (
      !(WARPCAST_MINT_ADDRESSES.indexOf(address) > -1) &&
      transaction.netAssetTransfers[address]?.received?.length === 1 &&
      (transaction.netAssetTransfers[address].received[0].type ===
        AssetType.ERC721 ||
        transaction.netAssetTransfers[address].received[0].type ===
          AssetType.ERC1155)
    ) {
      receivingAddress = address;
      if (
        transaction.netAssetTransfers[address].received[0].type ===
        AssetType.ERC721
      ) {
        const received = transaction.netAssetTransfers[address]
          .received[0] as ERC721Asset;
        minted = {
          type: AssetType.ERC721,
          token: received.contract,
          tokenId: received.tokenId,
        };
      } else {
        const received = transaction.netAssetTransfers[address]
          .received[0] as ERC1155Asset;
        minted = {
          type: AssetType.ERC1155,
          token: received.contract,
          tokenId: received.tokenId,
          value: received.value,
        };
      }
      break;
    }
  }
  // Pull out relevant data
  const sent = transaction.netAssetTransfers
    ? (transaction.netAssetTransfers[transaction.from].sent[0] as ETHAsset)
    : null;
  if (!sent) return transaction;

  transaction.context = {
    actions: [
      `${Protocols.WARPCAST}.${WarpcastContextActionEnum.MINTED}`,
      HeuristicContextActionEnum.MINTED,
    ],

    variables: {
      buyer: {
        type: 'address',
        value: receivingAddress,
      },
      cost: {
        type: AssetType.ETH,
        value: sent.value,
        unit: 'wei',
      },
      minted,
      contextAction: {
        type: 'contextAction',
        id: `${Protocols.WARPCAST}.${WarpcastContextActionEnum.MINTED}`,
        value: WarpcastContextActionEnum.MINTED,
      },
    },

    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: ProtocolMap[Protocols.WARPCAST],
        default: '[[buyer]][[contextAction]][[minted]]with Warps for[[cost]]',
      },
    },
  };

  return transaction;
}

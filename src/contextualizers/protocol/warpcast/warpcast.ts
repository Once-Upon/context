import {
  AssetType,
  ERC20Asset,
  Transaction,
  HeuristicContextActionEnum,
} from '../../../types';

const WARPCAST_DEPOSIT_ADDRESS = '0x79afe0fd5375ca1d30bb6b28ae7529a1e2387baa';

export function contextualize(transaction: Transaction): Transaction {
  const isBuyWarps = detect(transaction);

  if (!isBuyWarps) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // Warpcast uses services like UniswapV3 and the swapAndTransfer function to send funds for buying warps
  // They send funds to 0x79afe0fd5375ca1d30bb6b28ae7529a1e2387baa
  // Known sigHashes used:
  // 0x8bf122da - swapAndTransferUniswapV3Native(tuple _intent,uint24 poolFeesTier) - 0x26ae41ce48bfa7f6648d580d632261b7f69ee785a32a8ee55a94a5894b525264
  // 0x6614eb71 - unknown - 0x13406192d435651ee2c4e53865aec002532af3a28941ec3818df85633a0a0eaf
  // 0xccba8aac - unknown - 0xe6038ebf3dd7a2292d9235f89f443d270e90a5d819f0bdc0f445b1cbc33f8456
  if (
    (transaction.sigHash === '0x8bf122da' ||
      transaction.sigHash === '0x6614eb71' ||
      transaction.sigHash === '0xccba8aac') &&
    transaction.netAssetTransfers?.[WARPCAST_DEPOSIT_ADDRESS]?.received
      .length === 1 &&
    transaction.netAssetTransfers?.[WARPCAST_DEPOSIT_ADDRESS]?.received[0]
      .type === 'erc20'
  ) {
    return true;
  }
  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.netAssetTransfers) return transaction;

  // This is the ERC20 asset that the Farcaster deposit received
  const farcasterReceived = transaction.netAssetTransfers[
    WARPCAST_DEPOSIT_ADDRESS
  ].received[0] as ERC20Asset;

  // Get the other receiving address for the same asset Farcaster received (USDC)
  // NOTE - USDC is a different address on different networks, so we do this to avoid hardcoding each network's USDC address
  // This entity is Coinbase Merchant
  let feeCollectorReceived: ERC20Asset | null = null;
  for (const address in transaction.netAssetTransfers) {
    // Skip the Farcaster deposit address and only look at addresses that received 1 asset
    if (
      address !== WARPCAST_DEPOSIT_ADDRESS &&
      transaction.netAssetTransfers[address].received.length === 1
    ) {
      const received = transaction.netAssetTransfers[address].received[0];
      // Check if received is the same asset as Farcaster received (USDC on some network)
      if (
        received.type === 'erc20' &&
        received.contract === farcasterReceived.contract
      ) {
        feeCollectorReceived = transaction.netAssetTransfers[address]
          .received[0] as ERC20Asset;
        break;
      }
    }
  }

  // Safety check
  if (!feeCollectorReceived) return transaction;

  const buyerSentNetAsset =
    transaction.netAssetTransfers[transaction.from].sent[0];
  let buyerSent;
  if (buyerSentNetAsset.type === 'eth') {
    buyerSent = { type: 'eth', value: buyerSentNetAsset.value };
  } else if (buyerSentNetAsset.type === 'erc20') {
    buyerSent = {
      type: buyerSentNetAsset.type,
      token: buyerSentNetAsset.contract,
      value: buyerSentNetAsset.value,
    };
  } else {
    return transaction;
  }

  // Pull out relevant data for faucet transaction
  transaction.context = {
    variables: {
      buyer: {
        type: 'address',
        value: transaction.from,
      },
      cost: buyerSent,
      costInUSDC: {
        type: AssetType.ERC20,
        token: farcasterReceived.contract,
        value: (
          BigInt(farcasterReceived.value) + BigInt(feeCollectorReceived.value)
        ).toString(),
      },
      bought: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.BOUGHT,
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Farcaster',
        default: '[[buyer]][[bought]]Warps ([[costInUSDC]]) for[[cost]]',
      },
    },
  };

  return transaction;
}

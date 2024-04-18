import {
  formatEther,
  Abi,
  decodeFunctionData,
  decodeEventLog,
  Hex,
  parseAbi,
} from 'viem';
import {
  TransactionContextType,
  Transaction,
  ContextSummaryVariableType,
  EventLogTopics,
  AssetType,
  RawBlock,
  StdObj,
  NetAssetTransfers,
  ERC20Asset,
  ETHAsset,
  ERC721Asset,
  ERC1155Asset,
  AssetTransfer,
  ETHAssetTransfer,
  ERC721AssetTransfer,
  ERC1155AssetTransfer,
  ERC20AssetTransfer,
} from '../types';

const VALID_CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.? ';

export const hexToString = (str: string) => {
  const buf = Buffer.from(str, 'hex');
  return buf.toString('utf8');
};

export const countValidChars = (stringToCount: string) => {
  let count = 0;
  for (let i = 0; i < stringToCount.length; i++) {
    if (VALID_CHARS.indexOf(stringToCount[i]) >= 0) {
      count++;
    }
  }
  return count;
};

export function shortenTxHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return hash.substr(0, 6) + hash.substr(-4);
}

export function decodeTransactionInput<TAbi extends Abi>(
  input: Hex,
  abi: TAbi,
) {
  try {
    const result = decodeFunctionData({
      abi,
      data: input,
    });

    return result;
  } catch (err) {
    return null;
  }
}

export function decodeFunction(input: Hex, functionSig: string[]) {
  try {
    const abi = parseAbi(functionSig);
    const result = decodeFunctionData({
      abi,
      data: input,
    });

    return result;
  } catch (err) {
    return null;
  }
}

// We should get better type info from this helper
export function decodeLog<TAbi extends Abi>(
  abi: TAbi,
  data: Hex,
  topics: EventLogTopics,
) {
  try {
    const result = decodeEventLog({
      abi,
      data,
      topics,
    });
    return result;
  } catch (err) {
    return null;
  }
}

export function processNetAssetTransfers(netAssetTransfers: NetAssetTransfers) {
  const receivingAddresses: string[] = [];
  const sendingAddresses: string[] = [];
  let receivedNfts: (ERC721Asset | ERC1155Asset)[] = [];
  let erc20Payments: ERC20Asset[] = [];
  let ethPayments: ETHAsset[] = [];

  Object.entries(netAssetTransfers).forEach(([address, data]) => {
    const nftsReceived = data.received.filter((t) =>
      [AssetType.ERC1155, AssetType.ERC721].includes(t.type),
    ) as (ERC721Asset | ERC1155Asset)[];
    const nftsSent = data.sent.filter((t) =>
      [AssetType.ERC1155, AssetType.ERC721].includes(t.type),
    ) as (ERC721Asset | ERC1155Asset)[];
    const erc20PaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ERC20,
    ) as ERC20Asset[];
    const ethPaymentTransfers = data.sent.filter(
      (t) => t.type === AssetType.ETH,
    ) as ETHAsset[];

    if (nftsReceived.length > 0) {
      receivingAddresses.push(address);
      receivedNfts = [...receivedNfts, ...nftsReceived];
    }
    if (nftsSent.length > 0 && !sendingAddresses.includes(address)) {
      sendingAddresses.push(address);
    }
    if (erc20PaymentTransfers.length > 0) {
      erc20Payments = [
        ...erc20Payments,
        ...erc20PaymentTransfers.map((payment) => ({
          type: payment.type,
          contract: payment.contract,
          value: payment.value,
        })),
      ];
    }
    if (ethPaymentTransfers.length > 0) {
      ethPayments = [
        ...ethPayments,
        ...ethPaymentTransfers.map((payment) => ({
          type: payment.type,
          value: payment.value,
        })),
      ];
    }
  });

  return {
    receivingAddresses,
    sendingAddresses,
    erc20Payments,
    ethPayments,
    receivedNfts,
    receivedNftContracts: Array.from(
      new Set(receivedNfts.map((x) => x.contract)),
    ),
  };
}

export function processAssetTransfers(assetTransfers: AssetTransfer[]) {
  const receivingAddresses: string[] = [];
  const sendingAddresses: string[] = [];
  const receivedNfts: (ERC721AssetTransfer | ERC1155AssetTransfer)[] = [];
  const erc20Payments: ERC20AssetTransfer[] = [];
  const ethPayments: ETHAssetTransfer[] = [];

  for (const assetTransfer of assetTransfers) {
    if (
      assetTransfer.type === AssetType.ERC1155 ||
      assetTransfer.type === AssetType.ERC721
    ) {
      receivingAddresses.push(assetTransfer.to);
      sendingAddresses.push(assetTransfer.from);
      if (
        !receivedNfts.find(
          (x) =>
            x.contract === assetTransfer.contract &&
            x.tokenId === assetTransfer.tokenId,
        )
      ) {
        receivedNfts.push(
          assetTransfer as ERC721AssetTransfer | ERC1155AssetTransfer,
        );
      }
    }
    if (assetTransfer.type === AssetType.ERC20) {
      erc20Payments.push(assetTransfer);
    }
    if (assetTransfer.type === AssetType.ETH) {
      ethPayments.push(assetTransfer);
    }
  }

  return {
    receivingAddresses,
    sendingAddresses,
    erc20Payments,
    ethPayments,
    receivedNfts,
    receivedNftContracts: Array.from(
      new Set(receivedNfts.map((x) => x.contract)),
    ),
  };
}

export function computeETHPrice(
  ethPayments: ETHAssetTransfer[],
  address: string,
) {
  return ethPayments
    .filter((ethPayment) => ethPayment.from === address)
    .reduce((acc, next) => {
      acc = BigInt(acc) + BigInt(next.value);
      return acc;
    }, BigInt(0));
}

export function computeERC20Price(
  erc20Payments: ERC20AssetTransfer[],
  address: string,
) {
  return erc20Payments
    .filter((erc20Payment) => erc20Payment.from === address)
    .reduce((acc, next) => {
      acc[next.contract] = {
        id: next.contract,
        type: next.type,
        contract: next.contract,
        value: (
          BigInt(acc[next.contract]?.value || '0') + BigInt(next.value)
        ).toString(),
      };
      return acc;
    }, {});
}

export function contextSummary(
  context: TransactionContextType | undefined,
  version: 'default' | 'long' = 'default',
): string {
  if (!context || !context.summaries) return '';
  const summaryTemplate =
    version === 'default'
      ? context.summaries.en.default
      : context.summaries.en.long!;

  const regex = /(\[\[.*?\]\])/;
  const parts = summaryTemplate.split(regex).filter((x) => x);

  const formattedParts = parts.map((part) => {
    if (isVariable(part)) {
      const variableName = part.slice(2, -2);

      const varContext =
        context.variables?.[variableName] ||
        context.summaries?.en.variables?.[variableName];

      if (!varContext) return part;

      return formatSection(varContext);
    } else {
      return part;
    }
  });

  return formattedParts.join(' ');
}

function isVariable(str: string) {
  return str.startsWith('[[') && str.endsWith(']]');
}

function formatSection(section: ContextSummaryVariableType) {
  const varContext = section;
  const unit = varContext['unit'];

  if (varContext?.type === AssetType.ETH)
    return `${formatEther(BigInt(varContext?.value))}${unit ? ` ETH` : ''}`;

  if (varContext?.type === AssetType.ERC721) {
    return `${varContext.token}${
      varContext['tokenId'] ? ` #${varContext['tokenId']}` : ''
    }`;
  }

  if (varContext?.type === 'erc1155') {
    return `${varContext.value} ${varContext.token} #${varContext.tokenId}`;
  }

  if (varContext?.type === 'erc20')
    return `${varContext.value} ${varContext.token}`;

  return `${varContext.value}${unit ? ` ${unit}` : ''}`;
}

export const makeContextualize = (
  children: Record<string, (transaction: Transaction) => Transaction>,
) => {
  return (transaction: Transaction): Transaction => {
    for (const childContextualizer of Object.values(children)) {
      const result = childContextualizer(transaction);
      if (result.context?.summaries?.en.title) {
        return result;
      }
    }
    return transaction;
  };
};

export function containsBigInt(obj) {
  // Check if the current value is a BigInt
  if (typeof obj === 'bigint') {
    return true;
  }

  // If the value is an object or array, recurse into it
  if (obj !== null && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (containsBigInt(value)) {
          return true;
        }
      }
    }
  }

  // Return false if no BigInt found
  return false;
}

export const convertDate = (epochTime: number): string => {
  // Convert epoch time to milliseconds by multiplying by 1000 (JavaScript uses milliseconds)
  const date = new Date(epochTime * 1000);

  // Extract the month, day, and year
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Months are 0-based in JavaScript, add 1
  const day = ('0' + date.getUTCDate()).slice(-2);
  const year = date.getUTCFullYear();

  const dateString = `${year}-${month}-${day}`;

  return dateString;
};

export const makeTransform = (
  children: Record<string, (block: RawBlock) => RawBlock>,
) => {
  return (block: RawBlock): RawBlock => {
    for (const childTransformer of Object.values(children)) {
      block = childTransformer(block);
    }
    return block;
  };
};

// monkey-patch BigInt to serialize as JSON
// more context here: https://github.com/GoogleChromeLabs/jsbi/issues/30
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const bytecodeIsERC = (
  standard: Record<string, string>,
  bytecode: string,
): boolean => {
  const ercMethodsDetected = Object.keys(standard).filter(
    (key: string): boolean => bytecode.includes(standard[key]),
  );
  return ercMethodsDetected.length == Object.keys(standard).length;
};

export const normalizeBlock = (block: StdObj): RawBlock => {
  // console.log('block', block);

  let str = JSON.stringify(block);

  // replace all EVM addresses with lowercased versions
  str = str.replace(/("0x[A-z0-9]{40}")/g, (v) => v.toLowerCase());

  return JSON.parse(str) as RawBlock;
};

export const convertToString = (value: any): string => {
  // Check if the value is not null or undefined, and it has a toString() method.
  if (
    value !== null &&
    value !== undefined &&
    typeof value?.toString === 'function'
  ) {
    return value.toString();
  } else {
    // Return an empty string if the value is not convertible to a string.
    return '';
  }
};

export function splitStringIntoChunks(
  inputString: string,
  chunkSize: number,
): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < inputString.length; i += chunkSize) {
    chunks.push(inputString.slice(i, i + chunkSize));
  }
  return chunks;
}

export function objectToDotNotation(
  obj: Record<string, unknown>,
  current?: string,
) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const newObj = {};

  for (const key in obj) {
    const val = obj[key];
    const newKey = current ? `${current}.${key}` : key;
    if (val && typeof val === 'object') {
      Object.assign(
        newObj,
        objectToDotNotation(val as Record<string, unknown>, newKey),
      );
    } else {
      newObj[newKey] = val;
    }
  }

  return newObj;
}

export const getTokenName = async (token): Promise<string> => {
  try {
    return (await token.methods.name().call()) as string;
  } catch (error) {
    console.log(`Name method not implemented.`);
    return '';
  }
};

export const getTokenSymbol = async (token): Promise<string> => {
  try {
    return (await token.methods.symbol().call()) as string;
  } catch (error) {
    console.log('Symbol method not implemented.');
    return '';
  }
};

export const getTokenDecimals = async (token): Promise<number> => {
  try {
    return (await token.methods.decimals().call()) as number;
  } catch (error) {
    console.log('Decimals method not implemented.');
    return 18;
  }
};

export function decodeEVMAddress(addressString: string): string {
  if (!addressString) return '';

  const buf = Buffer.from(addressString.replace(/^0x/, ''), 'hex');
  if (!buf.slice(0, 12).equals(Buffer.alloc(12, 0))) {
    return '';
  }
  const address = '0x' + buf.toString('hex', 12, 32); // grab the last 20 bytes
  return address.toLocaleLowerCase();
}

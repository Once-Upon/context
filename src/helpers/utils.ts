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
  AssetType,
  EventLogTopic,
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
  topic0?: EventLogTopic,
  topic1?: EventLogTopic,
  topic2?: EventLogTopic,
  topic3?: EventLogTopic,
) {
  try {
    const topics = topic0 ? [topic0, topic1, topic2, topic3].filter(x => x) : [];
    const result = decodeEventLog({
      abi,
      data,
      topics: topics as [] | [
        signature: `0x${string}`,
        ...args: `0x${string}`[],
      ],
    });
    return result;
  } catch (err) {
    return null;
  }
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

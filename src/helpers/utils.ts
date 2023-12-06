import { utils } from 'ethers';
import { InterfaceAbi } from '../types/Abi';
import { TransactionContextType } from '../types/transaction';

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

export function decodeTransactionInput(
  input: string,
  abi: InterfaceAbi,
): utils.TransactionDescription {
  const iface = new utils.Interface(abi);
  const transactionDescriptor = iface.parseTransaction({
    data: input,
  });

  return transactionDescriptor;
}

export function contextSummary(context: TransactionContextType): string {
  const summaryTemplate = context.summaries.en.default;
  if (!summaryTemplate) return null;

  const regex = /(\[\[.*?\]\])/;
  const parts = summaryTemplate.split(regex).filter((x) => x);

  const formattedParts = parts.map((part, i) => {
    if (isVariable(part)) {
      const variableName = part.slice(2, -2);

      const varContext =
        context.variables[variableName] ||
        context.summaries.en.variables[variableName];
      return formatSection(varContext, i);
    } else {
      return part;
    }
  });

  return formattedParts.join('');
}

function isVariable(str) {
  return str.startsWith('[[') && str.endsWith(']]');
}

function formatSection(section, i) {
  const varContext = section;
  const varKey = i;

  if (varContext?.type === 'eth')
    return `${utils.formatEther(varContext?.value)} ETH`;

  if (varContext?.type === 'erc721' || varContext?.type === 'erc1155') {
    return `${varContext.token} #${varContext.tokenId}`;
  }

  if (varContext?.type === 'erc20')
    return `${varContext.value} ${varContext.token}`;

  return varContext?.value;
}

import { Hex } from 'viem';
import { ExtractAbiFunctionNames } from 'abitype';
import { Transaction } from '../../types';
import { decodeTransactionInput } from '../../helpers/utils';
import { ABIs, EAS_LINKS } from './constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBundler = detect(transaction);
  if (!isBundler) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  try {
    if (!transaction.to) {
      return false;
    }

    // NOTE: For some reason there are many transactions on mainnet to the
    // address of the EAS contract on OP stack chains (maybe misconfigured dApps?),
    // so we filter out those
    if (
      transaction.to === '0x4200000000000000000000000000000000000021' &&
      transaction.chainId === 1
    ) {
      return false;
    }

    // decode input
    const decoded = decodeTransactionInput(transaction.input as Hex, ABIs.EAS);

    if (!decoded || !decoded.functionName) return false;
    const handledFunctions: ExtractAbiFunctionNames<typeof ABIs.EAS>[] = [
      'attest',
      'attestByDelegation',
      'multiAttest',
      'multiAttestByDelegation',
      'revoke',
      'revokeByDelegation',
      'multiRevoke',
      'multiRevokeByDelegation',
      'timestamp',
      'multiTimestamp',
      'revokeOffchain',
      'multiRevokeOffchain',
    ];

    return handledFunctions.includes(decoded.functionName);
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

const pluralize = (word: string, n: number): string => {
  return `${word}${n !== 1 ? 's' : ''}`;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(transaction.input as Hex, ABIs.EAS);
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'attest': {
      const arg = decoded.args[0];
      const schema = arg.schema;
      const recipient = arg.data.recipient;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'schemaID',
            value: schema,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${schema}`
              : '',
          },
          recipient: {
            type: 'address',
            value: recipient,
          },
          attested: {
            type: 'contextAction',
            value: 'ATTESTED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: recipient
              ? '[[from]] [[attested]] to [[recipient]] with schema [[schema]]'
              : '[[from]] [[attested]] with schema [[schema]]',
          },
        },
      };
      return transaction;
    }

    case 'attestByDelegation': {
      const arg = decoded.args[0];
      const schema = arg.schema;
      const attester = arg.attester;
      const recipient = arg.data.recipient;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          attester: {
            type: 'address',
            value: attester,
          },
          schema: {
            type: 'schemaID',
            value: schema,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${schema}`
              : '',
          },
          recipient: {
            type: 'address',
            value: recipient,
          },
          attested: {
            type: 'contextAction',
            value: 'ATTESTED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: recipient
              ? '[[attester]] [[attested]] to [[recipient]] with schema [[schema]] by delegation via [[from]]'
              : '[[attester]] [[attested]] with schema [[schema]] by delegation via [[from]]',
          },
        },
      };
      return transaction;
    }

    case 'multiAttest': {
      const arg = decoded.args[0];
      const schemas = arg.length;
      const count = arg.map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schemas: {
            type: 'number',
            value: schemas,
            emphasis: true,
            unit: pluralize('schema', schemas),
          },
          count: {
            type: 'number',
            value: count,
            emphasis: true,
            unit: pluralize('time', count),
          },
          attested: {
            type: 'contextAction',
            value: 'ATTESTED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: `[[from]] [[attested]] [[count]] with [[schemas]]`,
          },
        },
      };
      return transaction;
    }

    case 'multiAttestByDelegation': {
      const arg = decoded.args[0];
      const schemas = arg.length;
      const attesters = Array.from(new Set(arg.map((v) => v.attester))).length;
      const count = arg.map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          attesters: {
            type: 'number',
            value: attesters,
            emphasis: true,
            unit: pluralize('account', attesters),
          },
          schemas: {
            type: 'number',
            emphasis: true,
            value: schemas,
            unit: pluralize('schema', schemas),
          },
          count: {
            type: 'number',
            emphasis: true,
            value: count,
            unit: pluralize('time', count),
          },
          attested: {
            type: 'contextAction',
            value: 'ATTESTED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: `[[attesters]] [[attested]] [[count]] with [[schemas]] by delegation via [[from]]`,
          },
        },
      };
      return transaction;
    }

    case 'revoke': {
      const arg = decoded.args[0];
      const schema = arg.schema;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'schemaID',
            value: schema,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${schema}`
              : '',
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[from]] [[revoked]] an attestation with schema [[schema]]',
          },
        },
      };
      return transaction;
    }

    case 'revokeByDelegation': {
      const arg = decoded.args[0];
      const { schema, revoker } = arg;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'schemaID',
            value: schema,
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${schema}`
              : '',
          },
          revoker: {
            type: 'address',
            value: revoker,
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[revoker]] [[revoked]] an attestation with schema [[schema]] by delegation via [[from]]',
          },
        },
      };
      return transaction;
    }

    case 'multiRevoke': {
      const arg = decoded.args[0];
      const schemas = arg.length;
      const count = arg.map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'schemaID',
            value: schemas.toString(),
            link: EAS_LINKS[transaction.chainId]
              ? `${EAS_LINKS[transaction.chainId]}/${schemas.toString()}`
              : '',
          },
          count: {
            type: 'number',
            emphasis: true,
            value: count,
            unit: pluralize('attestation', count),
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: `[[from]] [[revoked]] [[count]] with [[schema]]`,
          },
        },
      };
      return transaction;
    }

    case 'multiRevokeByDelegation': {
      const arg = decoded.args[0];
      const schemas = arg.length;
      const revokers = Array.from(new Set(arg.map((v) => v.revoker))).length;
      const count = arg.map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schemas: {
            type: 'number',
            emphasis: true,
            value: schemas,
            unit: pluralize('schema', schemas),
          },
          count: {
            type: 'number',
            emphasis: true,
            value: count,
            unit: pluralize('attestation', count),
          },
          revokers: {
            type: 'address',
            value: revokers.toString(),
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: `[[revokers]] [[revoked]] ${pluralize(
              'account',
              revokers,
            )} [[count]] with [[schemas]] by delegation via [[from]]`,
          },
        },
      };
      return transaction;
    }

    case 'timestamp': {
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          timestamped: {
            type: 'contextAction',
            value: 'TIMESTAMPED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[timestamped]] data',
          },
        },
      };
      return transaction;
    }

    case 'multiTimestamp': {
      const data = decoded.args[0];
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          count: {
            type: 'string',
            emphasis: true,
            value: data.length.toString(),
          },
          timestamped: {
            type: 'contextAction',
            value: 'TIMESTAMPED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[timestamped]] [[count]] data',
          },
        },
      };
      return transaction;
    }

    case 'revokeOffchain': {
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[revoked]] offchain data',
          },
        },
      };
      return transaction;
    }

    case 'multiRevokeOffchain': {
      const data = decoded.args[0];
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          count: {
            type: 'string',
            emphasis: true,
            value: data.length.toString(),
          },
          revoked: {
            type: 'contextAction',
            value: 'REVOKED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[revoked]] [[count]] offchain data',
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

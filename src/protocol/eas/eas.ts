import { TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { decodeTransactionInput } from '../../helpers/utils';
import { ABIs } from './constants';

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
    let decoded: TransactionDescription;
    try {
      decoded = decodeTransactionInput(transaction.input, ABIs.EAS);
    } catch (_) {
      return false;
    }

    if (!decoded || !decoded.name) return false;
    return [
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
      'multiRevokeOffChain',
    ].includes(decoded.name);
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

const pluralize = (word: string, n: number): string => {
  return `${word}${n !== 1 ? "s" : ""}`;
}

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(transaction.input, ABIs.EAS);

  switch (decoded.name) {
    case 'attest': {
      const { schema, data } = decoded.args[0];
      const { recipient } = data;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'emphasis',
            value: schema,
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
      const { schema, attester, data } = decoded.args[0];
      const { recipient } = data;

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
            type: 'emphasis',
            value: schema,
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
      const schemas = decoded.args[0].length;
      const count = decoded.args[0].map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schemas: {
            type: 'emphasis',
            value: schemas.toString(),
          },
          count: {
            type: 'emphasis',
            value: count.toString(),
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
            default:
              `[[from]] [[attested]] [[count]] ${pluralize("time", count)} with [[schemas]] ${pluralize("schema", schemas)}`,
          },
        },
      };
      return transaction;
    }

    case 'multiAttestByDelegation': {
      const schemas = decoded.args[0].length;
      const attesters = Array.from(
        new Set(decoded.args[0].map((v) => v.attester)),
      ).length;
      const count = decoded.args[0].map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          attesters: {
            type: 'emphasis',
            value: attesters.toString(),
          },
          schemas: {
            type: 'emphasis',
            value: schemas.toString(),
          },
          count: {
            type: 'emphasis',
            value: count.toString(),
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
            default:
              `[[attesters]] ${pluralize("account", attesters)} [[attested]] [[count]] ${pluralize("time", count)} with [[schemas]] ${pluralize("schema", schemas)} by delegation via [[from]]`,
          },
        },
      };
      return transaction;
    }

    case 'revoke': {
      const { schema } = decoded.args[0];

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'emphasis',
            value: schema,
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
      const { schema, revoker } = decoded.args[0];

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'emphasis',
            value: schema,
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
      const schemas = decoded.args[0].length;
      const count = decoded.args[0].map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schema: {
            type: 'emphasis',
            value: schemas.toString(),
          },
          count: {
            type: 'emphasis',
            value: count.toString(),
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
              `[[from]] [[revoked]] [[count]] ${pluralize("attestation", count)} with [[schemas]] ${pluralize("schema", schemas)}`,
          },
        },
      };
      return transaction;
    }

    case 'multiRevokeByDelegation': {
      const schemas = decoded.args[0].length;
      const revokers = Array.from(
        new Set(decoded.args[0].map((v) => v.revoker)),
      ).length;
      const count = decoded.args[0].map((v) => v.data).flat().length;

      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          schemas: {
            type: 'emphasis',
            value: schemas.toString(),
          },
          count: {
            type: 'emphasis',
            value: count.toString(),
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
            default:
              `[[revokers]] ${pluralize("account", revokers)} [[revoked]] [[count]] ${pluralize("attestation", count)} with [[schemas]] ${pluralize("schema", schemas)} by delegation via [[from]]`,
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
            type: 'emphasis',
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

    case 'multiRevokeOffChain': {
      const data = decoded.args[0];
      transaction.context = {
        variables: {
          from: {
            type: 'address',
            value: transaction.from,
          },
          count: {
            type: 'emphasis',
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

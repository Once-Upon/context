import { TransactionDescription } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { decodeTransactionInput } from '../../helpers/utils';
import { EAS_ADDRESSES, ABIs } from './constants';

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

    // check contract address
    if (!EAS_ADDRESSES.includes(transaction.to.toLowerCase())) {
      return false;
    }

    // decode input
    let decoded: TransactionDescription;
    try {
      decoded = decodeTransactionInput(transaction.input, ABIs.EAS);
    } catch (e) {
      console.log(e);
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: recipient
              ? '[[from]] [[attested]] to [[recipient ]] with schema [[schema]]'
              : '[[from]] [[attested]] with schema [[schema]]',
            variables: {
              attested: {
                type: 'contextAction',
                value: 'ATTESTED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: recipient
              ? '[[attester]] [[attested]] to [[recipient]] with schema [[schema]] by delegation via [[from]]'
              : '[[attester]] [[attested]] with schema [[schema]] by delegation via [[from]]',
            variables: {
              attested: {
                type: 'contextAction',
                value: 'ATTESTED',
              },
            },
          },
        },
      };
      return transaction;
    }

    case 'multiAttest': {
      const schemas = decoded.args[0].length;
      const count = decoded.args[0].map(v => v.data).flat().length;

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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[from]] [[attested]] [[count]] times with [[schemas]] schemas',
            variables: {
              attested: {
                type: 'contextAction',
                value: 'ATTESTED',
              },
            },
          },
        },
      };
      return transaction;
    }

    case 'multiAttestByDelegation': {
      const schemas = decoded.args[0].length;
      const attesters = Array.from(new Set(decoded.args[0].map(v => v.attester))).length;
      const count = decoded.args[0].map(v => v.data).flat().length;

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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[attesters]] accounts [[attested]] [[count]] times with [[schemas]] schemas by delegation via [[from]]',
            variables: {
              attested: {
                type: 'contextAction',
                value: 'ATTESTED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[from]] [[revoked]] an attestation with schema [[schema]]',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[revoker]] [[revoked]] an attestation with schema [[schema]] by delegation via [[from]]',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
          },
        },
      };
      return transaction;
    }

    case 'multiRevoke': {
      const schemas = decoded.args[0].length;
      const count = decoded.args[0].map(v => v.data).flat().length;

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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[from]] [[revoked]] [[count]] attestations with [[schemas]] schemas',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
          },
        },
      };
      return transaction;
    }

    case 'multiRevokeByDelegation': {
      const schemas = decoded.args[0].length;
      const revokers = Array.from(new Set(decoded.args[0].map(v => v.revoker))).length;
      const count = decoded.args[0].map(v => v.data).flat().length;

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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default:
              '[[revokers]] accounts [[revoked]] [[count]] attestations with [[schemas]] schemas by delegation via [[from]]',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[timestamped]] data',
            variables: {
              timestamped: {
                type: 'contextAction',
                value: 'TIMESTAMPED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[timestamped]] [[count]] data',
            variables: {
              timestamped: {
                type: 'contextAction',
                value: 'TIMESTAMPED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[revoked]] offchain data',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'EAS',
            default: '[[from]] [[revoked]] [[count]] offchain data',
            variables: {
              revoked: {
                type: 'contextAction',
                value: 'REVOKED',
              },
            },
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

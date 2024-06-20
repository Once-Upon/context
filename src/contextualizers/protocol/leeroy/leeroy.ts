import { Hex, toBytes } from 'viem';
import {
  AssetType,
  ContextSummaryVariableType,
  ETHAsset,
  LeeroyContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { LeeroyContracts } from './constants';
import { decodeFunction } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isLeeroy = detect(transaction);
  if (!isLeeroy) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (
    transaction.to !== LeeroyContracts.v1 &&
    transaction.to !== LeeroyContracts.v2
  ) {
    return false;
  }

  if (
    transaction.sigHash !== '0x8ee93cf3' && // post
    transaction.sigHash !== '0xa66b7748' && // follow
    transaction.sigHash !== '0x4b91ab35' && // unfollow
    transaction.sigHash !== '0x7e93163b' && // tip
    transaction.sigHash !== '0x9d7eb375' && // updateUserDetails
    transaction.sigHash !== '0xa83b1e21' && // reply
    transaction.sigHash !== '0x3a4de190' && // repost
    transaction.sigHash !== '0x66e34dc6' // registerUsername
  ) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  switch (transaction.sigHash) {
    case '0x8ee93cf3': {
      // post(string)
      const functionSig = `function post(string)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      let post = { text: '' };
      try {
        post = JSON.parse(decoded[0]);
      } catch (e) {}
      const poster: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.POSTED}`],

          variables: {
            poster,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.POSTED}`,
              value: LeeroyContextActionEnum.POSTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[poster]][[contextAction]]${post.text}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.POSTED}`],

          variables: {
            poster,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.POSTED}`,
              value: LeeroyContextActionEnum.POSTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[poster]][[contextAction]]${post.text}`,
            },
          },
        };
      }
      break;
    }
    case '0xa66b7748': {
      // follow(bytes32)
      const functionSig = `function follow(bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const bytesUsername = decoded[0];
      const byteArrayUsername = toBytes(bytesUsername);
      let username = '';
      byteArrayUsername.forEach((charCode: number) => {
        username += String.fromCharCode(charCode);
      });
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.FOLLOWED}`],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.FOLLOWED}`,
              value: LeeroyContextActionEnum.FOLLOWED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]]${username}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.FOLLOWED}`],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.FOLLOWED}`,
              value: LeeroyContextActionEnum.FOLLOWED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]]${username}`,
            },
          },
        };
      }
      break;
    }
    case '0x4b91ab35': {
      // unfollow(bytes32)
      const functionSig = `function unfollow(bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const bytesUsername = decoded[0];
      const byteArrayUsername = toBytes(bytesUsername);
      let username = '';
      byteArrayUsername.forEach((charCode: number) => {
        username += String.fromCharCode(charCode);
      });
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.UNFOLLOWED}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.UNFOLLOWED}`,
              value: LeeroyContextActionEnum.UNFOLLOWED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]]${username}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.UNFOLLOWED}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.UNFOLLOWED}`,
              value: LeeroyContextActionEnum.UNFOLLOWED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]]${username}`,
            },
          },
        };
      }
      break;
    }
    case '0x7e93163b': {
      // tip(bytes32,bytes32) NOTE -
      const functionSig = `function tip(bytes32,bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const tipper: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const tipAmount: ContextSummaryVariableType = {
        type: AssetType.ETH,
        value: transaction.value.toString(),
        unit: 'wei',
      };
      const bytesUsername = decoded[0];
      const byteArrayUsername = toBytes(bytesUsername);
      let username = '';
      byteArrayUsername.forEach((charCode: number) => {
        username += String.fromCharCode(charCode);
      });
      if (
        transaction.receipt?.status &&
        transaction.netAssetTransfers &&
        transaction.to
      ) {
        const asset = transaction.netAssetTransfers[transaction.to]
          .received[0] as ETHAsset;
        const leeroyTake: ContextSummaryVariableType = {
          type: AssetType.ETH,
          value: asset.value,
          unit: 'wei',
        };
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.TIPPED}`],

          variables: {
            tipper,
            tipAmount,
            leeroyTake,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.TIPPED}`,
              value: LeeroyContextActionEnum.TIPPED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[tipper]][[contextAction]]${username}[[tipAmount]](Leeroy fee:[[leeroyTake]])`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.TIPPED}`],

          variables: {
            tipper,
            tipAmount,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.TIPPED}`,
              value: LeeroyContextActionEnum.TIPPED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[tipper]][[contextAction]]${username}[[tipAmount]]`,
            },
          },
        };
      }
      break;
    }
    case '0x9d7eb375': {
      // updateUserDetails(string)
      const functionSig = `function updateUserDetails(string)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      let userDetails = {};
      try {
        userDetails = JSON.parse(decoded[0]);
      } catch (e) {}
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.UPDATED_USER_DETAILS}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.UPDATED_USER_DETAILS}`,
              value: LeeroyContextActionEnum.UPDATED_USER_DETAILS,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]]${JSON.stringify(
                userDetails,
              )}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.UPDATED_USER_DETAILS}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.UPDATED_USER_DETAILS}`,
              value: LeeroyContextActionEnum.UPDATED_USER_DETAILS,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]]${JSON.stringify(
                userDetails,
              )}`,
            },
          },
        };
      }
      break;
    }
    case '0xa83b1e21': {
      // reply(string,bytes32)
      const functionSig = `function reply(string,bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const transactionHash: ContextSummaryVariableType = {
        type: 'transaction',
        value: decoded[1],
      };
      let post = { text: '' };
      try {
        post = JSON.parse(decoded[0]);
      } catch (e) {}
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPLIED_TO}`,
          ],

          variables: {
            user,
            transactionHash,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPLIED_TO}`,
              value: LeeroyContextActionEnum.REPLIED_TO,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]][[transactionHash]]${post.text}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPLIED_TO}`,
          ],

          variables: {
            user,
            transactionHash,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPLIED_TO}`,
              value: LeeroyContextActionEnum.REPLIED_TO,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]][[transactionHash]]${post.text}`,
            },
          },
        };
      }
      break;
    }
    case '0x3a4de190': {
      // repost(bytes32)
      const functionSig = `function repost(bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const transactionHash: ContextSummaryVariableType = {
        type: 'transaction',
        value: decoded[0],
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.REPOSTED}`],

          variables: {
            user,
            transactionHash,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPOSTED}`,
              value: LeeroyContextActionEnum.REPOSTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]][[transactionHash]]`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [`${Protocols.LEEROY}.${LeeroyContextActionEnum.REPOSTED}`],

          variables: {
            user,
            transactionHash,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REPOSTED}`,
              value: LeeroyContextActionEnum.REPOSTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]][[transactionHash]]`,
            },
          },
        };
      }
      break;
    }
    case '0x66e34dc6': {
      // registerUsername(bytes32)
      const functionSig = `function registerUsername(bytes32)`;
      const decoded = decodeFunction(transaction.input as Hex, [functionSig]);
      if (!decoded) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const bytesUsername = decoded[0];
      const byteArrayUsername = toBytes(bytesUsername);
      let username = '';
      byteArrayUsername.forEach((charCode: number) => {
        username += String.fromCharCode(charCode);
      });
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.REGISTERED_USERNAME}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REGISTERED_USERNAME}`,
              value: LeeroyContextActionEnum.REGISTERED_USERNAME,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `[[user]][[contextAction]]${username}`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.LEEROY}.${LeeroyContextActionEnum.REGISTERED_USERNAME}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.LEEROY}.${LeeroyContextActionEnum.REGISTERED_USERNAME}`,
              value: LeeroyContextActionEnum.REGISTERED_USERNAME,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.LEEROY],
              default: `Failed:[[user]][[contextAction]]${username}`,
            },
          },
        };
      }
      break;
    }
    default: {
      break;
    }
  }
  return transaction;
};

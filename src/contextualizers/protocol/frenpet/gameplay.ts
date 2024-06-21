import { Hex, parseAbi } from 'viem';
import { contracts, abiMapping, frenPetItemsMapping } from './constants';
import {
  ContextSummaryVariableType,
  Transaction,
  EventLogTopics,
  AssetType,
  ContextERC20Type,
  ERC20Asset,
  ContextERC721Type,
  ERC721Asset,
  FrenpetContextActionEnum,
  ProtocolMap,
  Protocols,
  HeuristicContextActionEnum,
} from '../../../types';
import { decodeFunction, decodeLog } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFrenPet = detect(transaction);
  if (!isFrenPet) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (
    transaction.chainId === 8453 &&
    transaction.to === contracts.frenPetGameplayContractV1
  ) {
    return true;
  } else {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  switch (transaction.sigHash) {
    case '0x715488b0': {
      // buyAccessory(uint256,uint256)
      // first argument is the petId
      // second argument is the accessoryId
      const abi = [abiMapping.buyAccessoryFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const petId = (parsed.args[0] as bigint).toString();
      const pet: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: petId,
      };
      const accessory = frenPetItemsMapping[parsed.args[1] as number];
      if (transaction.receipt?.status && transaction.netAssetTransfers) {
        const asset = transaction.netAssetTransfers[transaction.from]
          .sent[0] as ERC20Asset;
        const purchasePrice: ContextERC20Type = {
          type: AssetType.ERC20,
          token: contracts.frenPetERC20TokenContract,
          value: asset.value,
        };
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.BOUGHT_ACCESSORY}`,
          ],

          variables: {
            buyer,
            pet,
            purchasePrice,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.BOUGHT_ACCESSORY}`,
              value: FrenpetContextActionEnum.BOUGHT_ACCESSORY,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[buyer]][[contextAction]]${accessory} for[[pet]]for[[purchasePrice]]`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.BOUGHT_ACCESSORY}`,
          ],

          variables: {
            buyer,
            pet,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.BOUGHT_ACCESSORY}`,
              value: FrenpetContextActionEnum.BOUGHT_ACCESSORY,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `Failed:[[buyer]][[contextAction]]${accessory} for[[pet]]`,
            },
          },
        };
      }

      return transaction;
    }

    case '0xe1fa7638': {
      // attack(uint256,uint256)
      // emits Attack (uint256 attacker, uint256 winner, uint256 loser, uint256 scoresWon)
      // first argument is the attacker petId
      // second argument is the defender petId
      const abi = [abiMapping.attackFunction, abiMapping.attackEvent];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const attacker: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      const attacked: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[1] as bigint).toString(),
      };
      if (transaction.receipt?.status) {
        if (!transaction.logs || transaction.logs?.length) {
          return transaction;
        }

        const parsedLog = decodeLog(
          parseAbi(abi),
          transaction.logs[0]?.data as Hex,
          [
            transaction.logs[0]?.topic0,
            transaction.logs[0]?.topic1,
            transaction.logs[0]?.topic2,
            transaction.logs[0]?.topic3,
          ] as EventLogTopics,
        );
        if (!parsedLog) return transaction;

        const attackerArg = parsedLog.args[0] as string;
        const winnerArg = parsedLog.args[1] as string;
        const scoresWonArg = parsedLog.args[3] as bigint;
        const scoresWon = (scoresWonArg / BigInt(100000000000)).toString();
        const winOrLose = attackerArg === winnerArg ? 'won' : 'lost';
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
          ],

          variables: {
            attacker,
            attacked,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
              value: FrenpetContextActionEnum.ATTACKED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[attacker]][[contextAction]][[attacked]]and ${winOrLose} ${scoresWon} points`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
          ],

          variables: {
            attacker,
            attacked,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
              value: FrenpetContextActionEnum.ATTACKED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `Failed:[[attacker]][[contextAction]][[attacked]]`,
            },
          },
        };
      }
      return transaction;
    }

    case '0x6a627842': {
      // mint(address)
      const minter: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (transaction.receipt?.status && transaction.netAssetTransfers) {
        const assetReceived = transaction.netAssetTransfers[transaction.from]
          .received[0] as ERC721Asset;
        const assetSent = transaction.netAssetTransfers[transaction.from]
          .sent[0] as ERC20Asset;

        if (!assetReceived || !assetSent) return transaction;

        const pet: ContextERC721Type = {
          type: AssetType.ERC721,
          token: contracts.frenPetNFTTokenContract,
          tokenId: assetReceived.tokenId,
        };
        const cost: ContextERC20Type = {
          type: AssetType.ERC20,
          token: contracts.frenPetERC20TokenContract,
          value: assetSent.value,
        };
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.MINTED}`,
            HeuristicContextActionEnum.MINTED,
          ],

          variables: {
            minter,
            pet,
            cost,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.MINTED}`,
              value: FrenpetContextActionEnum.MINTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[minter]][[contextAction]][[pet]]for[[cost]]`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.MINTED}`,
            HeuristicContextActionEnum.MINTED,
          ],

          variables: {
            minter,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.MINTED}`,
              value: FrenpetContextActionEnum.MINTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `Failed:[[minter]][[contextAction]]a Fren Pet`,
            },
          },
        };
      }
      return transaction;
    }
    case '0x4d578c93': {
      // setPetName(uint256,string)
      const abi = [abiMapping.setPetNameFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      const name = parsed.args[1];
      transaction.context = {
        actions: [
          `${Protocols.FRENPET}.${FrenpetContextActionEnum.SET_PET_NAME}`,
        ],

        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.SET_PET_NAME}`,
            value: FrenpetContextActionEnum.SET_PET_NAME,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FRENPET],
            default: `[[user]][[contextAction]]for[[pet]]to ${name}`,
          },
        },
      };
      return transaction;
    }

    case '0x6935aa43': {
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
              value: FrenpetContextActionEnum.WHEEL_COMMITTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[user]][[contextAction]]`,
            },
          },
        };
      } else {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
          ],

          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
              value: FrenpetContextActionEnum.WHEEL_COMMITTED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[user]][[contextAction]]`,
            },
          },
        };
      }
      return transaction;
    }

    case '0xdb006a75': {
      // redeem(uint256)
      // first argument is the petId
      const abi = [abiMapping.redeemFunction, abiMapping.redeemRewardsEvent];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const petId = (parsed.args[0] as bigint).toString();
      const pet: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: petId,
      };
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (!transaction.receipt?.status) {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.REDEEMED}`,
          ],

          variables: {
            user,
            pet,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.REDEEMED}`,
              value: FrenpetContextActionEnum.REDEEMED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[user]][[contextAction]]for[[pet]]`,
            },
          },
        };
      } else {
        if (!transaction || !transaction.logs?.length) {
          return transaction;
        }
        const parsedLog = decodeLog(
          parseAbi(abi),
          transaction.logs[0]?.data as Hex,
          [
            transaction.logs[0]?.topic0,
            transaction.logs[0]?.topic1,
            transaction.logs[0]?.topic2,
            transaction.logs[0]?.topic3,
          ] as EventLogTopics,
        );
        if (!parsedLog) return transaction;

        const redeemedAmountString = parsedLog.args[1] as string;
        const redeemedAmount: ContextSummaryVariableType = {
          type: AssetType.ERC20,
          token: contracts.frenPetERC20TokenContract,
          value: redeemedAmountString,
        };
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.REDEEMED}`,
          ],

          variables: {
            user,
            pet,
            redeemedAmount,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.REDEEMED}`,
              value: FrenpetContextActionEnum.REDEEMED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[user]][[contextAction]][[redeemedAmount]]for[[pet]]`,
            },
          },
        };
      }
      return transaction;
    }

    case '0x3935a788': {
      // bonkCommit(uint256 attackerId,uint256 targetId,bytes32 nonce,bytes32 commit,bytes signature)
      // first argument is the attackerId
      // second argument is the targetId
      const abi = [abiMapping.bonkCommitFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const attacker: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      const target: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[1] as bigint).toString(),
      };

      transaction.context = {
        actions: [
          `${Protocols.FRENPET}.${FrenpetContextActionEnum.COMMITTED_TO_ATTACKING}`,
        ],

        variables: {
          user,
          attacker,
          target,
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.COMMITTED_TO_ATTACKING}`,
            value: FrenpetContextActionEnum.COMMITTED_TO_ATTACKING,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FRENPET],
            default: `[[user]][[contextAction]]with[[attacker]]attacking[[target]]`,
          },
        },
      };
      return transaction;
    }
    case '0xa4333d91': {
      // bonkReveal(uint256 attackerId,bytes32 reveal)
      // first argument is the attackerId
      const abi = [
        abiMapping.bonkRevealFunction,
        abiMapping.attackEvent,
        abiMapping.sellItemEvent,
        abiMapping.bonkTooSlowEvent,
      ];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const attacker: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      if (transaction.receipt?.status) {
        if (
          transaction.logs &&
          transaction.logs?.filter(
            (log) =>
              log.topic0 ===
              '0x8d02746aaac19768ccd257b3b666918a78b779c9f3d243bf3720313655a28004',
          ).length >= 1
        ) {
          // bonkTooSlowEvent
          transaction.context = {
            actions: [
              `${Protocols.FRENPET}.${FrenpetContextActionEnum.TOO_SLOW_TO_ATTACK}`,
            ],

            variables: {
              user,
              attacker,
              contextAction: {
                type: 'contextAction',
                id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.TOO_SLOW_TO_ATTACK}`,
                value: FrenpetContextActionEnum.TOO_SLOW_TO_ATTACK,
              },
            },

            summaries: {
              category: 'PROTOCOL_1',
              en: {
                title: ProtocolMap[Protocols.FRENPET],
                default: `[[user]][[contextAction]]with[[attacker]]`,
              },
            },
          };
        } else {
          const attackLogs = transaction.logs?.filter(
            (log) =>
              log.topic0 ===
              '0xcf2d586a11b0df2dc974a66369ad4e68566a0635fd2448e810592eac3d3bedae', // Attack(uint256 attacker, uint256 winner, uint256 loser, uint256 scoresWon)
          );
          if (!attackLogs || attackLogs?.length) {
            return transaction;
          }

          const attackLog = attackLogs[0];
          const parsedLog = decodeLog(
            parseAbi(abi),
            attackLog.data as Hex,
            [
              attackLog.topic0,
              attackLog.topic1,
              attackLog.topic2,
              attackLog.topic3,
            ] as EventLogTopics,
          );
          if (!parsedLog) return transaction;

          const attackerArg = parsedLog.args[1] as string;
          const winnerArg = parsedLog.args[1] as string;
          const loserArg = parsedLog.args[2] as string;
          const scoresWon = parsedLog.args[3] as bigint;
          const winOrLose = attackerArg === winnerArg ? 'won' : 'lost';
          const scoresWonFormatted = (
            scoresWon / BigInt(100000000000)
          ).toString();
          transaction.context = {
            actions: [
              `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
            ],

            variables: {
              user,
              attacker,
              winner: {
                type: 'string',
                value: winnerArg,
              },
              loser: {
                type: 'string',
                value: loserArg,
              },
              scoresWonFormatted: {
                type: 'string',
                value: scoresWonFormatted,
              },
              contextAction: {
                type: 'contextAction',
                id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
                value: FrenpetContextActionEnum.ATTACKED,
              },
            },

            summaries: {
              category: 'PROTOCOL_1',
              en: {
                title: ProtocolMap[Protocols.FRENPET],
                default: `[[user]][[contextAction]]with[[attacker]]attacking[[loser]]and ${winOrLose} ${scoresWonFormatted} points`,
              },
            },
          };
        }
      } else {
        transaction.context = {
          actions: [
            `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
          ],

          variables: {
            user,
            attacker,
            contextAction: {
              type: 'contextAction',
              id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.ATTACKED}`,
              value: FrenpetContextActionEnum.ATTACKED,
            },
          },

          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: ProtocolMap[Protocols.FRENPET],
              default: `[[user]][[contextAction]]with[[attacker]]`,
            },
          },
        };
      }
      return transaction;
    }
    case '0xe2c352ed': {
      //kill(uint256,uint256)
      // first argument is the deadId
      // second argument is the killer id
      const abi = [abiMapping.killFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const dead: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      const killer: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[1] as bigint).toString(),
      };
      transaction.context = {
        actions: [`${Protocols.FRENPET}.${FrenpetContextActionEnum.KILLED}`],

        variables: {
          user,
          dead,
          killer,
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.KILLED}`,
            value: FrenpetContextActionEnum.KILLED,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FRENPET],
            default: `[[user]][[contextAction]][[dead]]with[[killer]]`,
          },
        },
      };
    }

    case '0x1e54cd47': {
      // wheelCommit(uint256,uint256,bytes32,bytes)
      // first argument is the petId
      // second argument is gameId
      const abi = [abiMapping.wheelCommitFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      transaction.context = {
        actions: [
          `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
        ],

        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_COMMITTED}`,
            value: FrenpetContextActionEnum.WHEEL_COMMITTED,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FRENPET],
            default: `[[user]][[contextAction]]with[[pet]]`,
          },
        },
      };
      return transaction;
    }

    case '0xc86d8bb0': {
      // wheelReveal(uint256,bytes32)
      // first argument is the petId
      const abi = [abiMapping.wheelRevealFunction];
      const parsed = decodeFunction(transaction.input as Hex, abi);
      if (!parsed || !parsed.args) return transaction;

      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: AssetType.ERC721,
        token: contracts.frenPetNFTTokenContract,
        tokenId: (parsed.args[0] as bigint).toString(),
      };
      transaction.context = {
        actions: [
          `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_REVEALED}`,
        ],

        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            id: `${Protocols.FRENPET}.${FrenpetContextActionEnum.WHEEL_REVEALED}`,
            value: FrenpetContextActionEnum.WHEEL_REVEALED,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FRENPET],
            default: `[[user]][[contextAction]]with[[pet]]`,
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

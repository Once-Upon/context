import { ethers } from 'ethers';
import { contracts, abiMapping, frenPetItemsMapping } from './constants';
import { ContextSummaryVariableType, Transaction } from '../../types';

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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const buyer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const petId = parsed.args[0].toString();
      const pet: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: petId,
      };
      const accessory = frenPetItemsMapping[parsed.args[1].toNumber()];
      if (transaction.receipt?.status) {
        const purchasePrice: ContextSummaryVariableType = {
          type: 'erc20',
          token: contracts.frenPetERC20TokenContract,
          value: transaction.netAssetTransfers[transaction.from].sent[0].value,
        };
        transaction.context = {
          variables: {
            buyer,
            pet,
            purchasePrice,
            contextAction: {
              type: 'contextAction',
              value: 'BOUGHT_ACCESSORY',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[buyer]] [[contextAction]] ${accessory} for [[pet]] for [[purchasePrice]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            buyer,
            pet,
            contextAction: {
              type: 'contextAction',
              value: 'BOUGHT_ACCESSORY',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[buyer]] [[contextAction]] ${accessory} for [[pet]]`,
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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const attacker: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      const attacked: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[1].toString(),
      };
      if (transaction.receipt?.status) {
        const parsedLog = iface.parseLog({
          topics: transaction.logs[0]?.topics,
          data: transaction.logs[0]?.data,
        });
        const winner = parsedLog.args[1].toString();
        let scoresWon = parsedLog.args[3];
        scoresWon = scoresWon.div(100000000000).toString();
        const winOrLose = attacker === winner ? 'won' : 'lost';
        transaction.context = {
          variables: {
            attacker,
            attacked,
            contextAction: {
              type: 'contextAction',
              value: 'ATTACKED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[attacker]] [[contextAction]] [[attacked]] and ${winOrLose} ${scoresWon} points`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            attacker,
            attacked,
            contextAction: {
              type: 'contextAction',
              value: 'ATTACKED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[attacker]] [[contextAction]] [[attacked]]`,
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
      if (transaction.receipt?.status) {
        const pet: ContextSummaryVariableType = {
          type: 'erc721',
          token: contracts.frenPetNFTTokenContract,
          tokenId:
            transaction.netAssetTransfers[transaction.from].received[0].tokenId,
        };
        const cost: ContextSummaryVariableType = {
          type: 'erc20',
          token: contracts.frenPetERC20TokenContract,
          value: transaction.netAssetTransfers[transaction.from].sent[0].value,
        };
        transaction.context = {
          variables: {
            minter,
            pet,
            cost,
            contextAction: {
              type: 'contextAction',
              value: 'MINTED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[minter]] [[contextAction]] [[pet]] for [[cost]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            minter,
            contextAction: {
              type: 'contextAction',
              value: 'MINTED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[minter]] [[contextAction]] a Fren Pet`,
            },
          },
        };
      }
      return transaction;
    }
    case '0x4d578c93': {
      // setPetName(uint256,string)
      const abi = [abiMapping.setPetNameFunction];
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      const name = parsed.args[1];
      transaction.context = {
        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            value: 'SET_PET_NAME',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] for [[pet]] to ${name}`,
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
          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              value: 'WHEEL_COMMITTED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]]`,
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            user,
            contextAction: {
              type: 'contextAction',
              value: 'WHEEL_COMMITTED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]]`,
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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const petId = parsed.args[0].toString();
      const pet: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: petId,
      };
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      if (!transaction.receipt?.status) {
        transaction.context = {
          variables: {
            user,
            pet,
            contextAction: {
              type: 'contextAction',
              value: 'REDEEMED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]] for [[pet]]`,
            },
          },
        };
      } else {
        const parsedLog = iface.parseLog({
          topics: transaction.logs[0]?.topics,
          data: transaction.logs[0]?.data,
        });
        const redeemedAmountString = parsedLog.args[1].toString();
        const redeemedAmount: ContextSummaryVariableType = {
          type: 'erc20',
          token: contracts.frenPetERC20TokenContract,
          value: redeemedAmountString,
        };
        transaction.context = {
          variables: {
            user,
            pet,
            redeemedAmount,
            contextAction: {
              type: 'contextAction',
              value: 'REDEEMED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]] [[redeemedAmount]] for [[pet]]`,
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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const attacker: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      const target: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[1].toString(),
      };

      transaction.context = {
        variables: {
          user,
          attacker,
          target,
          contextAction: {
            type: 'contextAction',
            value: 'COMMITTED_TO_ATTACKING',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] with [[attacker]] attacking [[target]]`,
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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const attacker: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      if (transaction.receipt?.status) {
        if (
          transaction.logs?.filter(
            (log) =>
              log.topics[0] ===
              '0x8d02746aaac19768ccd257b3b666918a78b779c9f3d243bf3720313655a28004',
          ).length >= 1
        ) {
          // bonkTooSlowEvent
          transaction.context = {
            variables: {
              user,
              attacker,
              contextAction: {
                type: 'contextAction',
                value: 'TOO_SLOW_TO_ATTACK',
              },
            },
            summaries: {
              category: 'PROTOCOL_1',
              en: {
                title: 'Fren Pet',
                default: `[[user]] [[contextAction]] with [[attacker]]`,
              },
            },
          };
        } else {
          const attackLog = transaction.logs?.filter(
            (log) =>
              log.topics[0] ===
              '0xcf2d586a11b0df2dc974a66369ad4e68566a0635fd2448e810592eac3d3bedae', // Attack(uint256 attacker, uint256 winner, uint256 loser, uint256 scoresWon)
          )[0];
          const parsedLog = iface.parseLog({
            topics: attackLog.topics,
            data: attackLog.data,
          });
          const winner = parsedLog.args[1].toString();
          const loser = parsedLog.args[2].toString();
          const scoresWon = parsedLog.args[3];
          const winOrLose = attacker === winner ? 'won' : 'lost';
          const scoresWonFormatted = scoresWon.div(100000000000).toString();
          transaction.context = {
            variables: {
              user,
              attacker,
              winner,
              loser,
              scoresWonFormatted,
              contextAction: {
                type: 'contextAction',
                value: 'ATTACKED',
              },
            },
            summaries: {
              category: 'PROTOCOL_1',
              en: {
                title: 'Fren Pet',
                default: `[[user]] [[contextAction]] with [[attacker]] attacking [[loser]] and ${winOrLose} ${scoresWonFormatted} points`,
              },
            },
          };
        }
      } else {
        transaction.context = {
          variables: {
            user,
            attacker,
            contextAction: {
              type: 'contextAction',
              value: 'ATTACKED',
            },
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]] with [[attacker]]`,
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
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const dead: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      const killer: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[1].toString(),
      };
      transaction.context = {
        variables: {
          user,
          dead,
          killer,
          contextAction: {
            type: 'contextAction',
            value: 'KILLED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] [[dead]] with [[killer]]`,
          },
        },
      };
    }

    case '0x1e54cd47': {
      // wheelCommit(uint256,uint256,bytes32,bytes)
      // first argument is the petId
      // second argument is gameId
      const abi = [abiMapping.wheelCommitFunction];
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      transaction.context = {
        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            value: 'WHEEL_COMMITTED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] with [[pet]]`,
          },
        },
      };
      return transaction;
    }

    case '0xc86d8bb0': {
      // wheelReveal(uint256,bytes32)
      // first argument is the petId
      const abi = [abiMapping.wheelRevealFunction];
      const iface = new ethers.utils.Interface(abi);
      const parsed = iface.parseTransaction({
        data: transaction.input,
        value: transaction.value,
      });
      const user: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const pet: ContextSummaryVariableType = {
        type: 'erc721',
        token: contracts.frenPetNFTTokenContract,
        tokenId: parsed.args[0].toString(),
      };
      transaction.context = {
        variables: {
          user,
          pet,
          contextAction: {
            type: 'contextAction',
            value: 'WHEEL_REVEALED',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] with [[pet]]`,
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

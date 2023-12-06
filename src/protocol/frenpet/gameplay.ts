import { ethers } from 'ethers';
import { contracts, abiMapping, frenPetItemsMapping } from './constants';
import { ContextSummaryVariableType, Transaction } from '../../types';

export const frenPetContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isFrenPet = detectFrenPet(transaction);
  if (!isFrenPet) return transaction;

  return generateFrenPetContext(transaction);
};

const detectFrenPet = (transaction: Transaction): boolean => {
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
const generateFrenPetContext = (transaction: Transaction): Transaction => {
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
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[buyer]] [[contextAction]] ${accessory} for [[pet]] for [[purchasePrice]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'bought accessory',
                },
              },
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            buyer,
            pet,
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[buyer]] [[contextAction]] ${accessory} for [[pet]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'bought accessory',
                },
              },
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
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[attacker]] [[contextAction]] [[attacked]] and ${winOrLose} ${scoresWon} points`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'attacked',
                },
              },
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            attacker,
            attacked,
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[attacker]] [[contextAction]] [[attacked]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'attacked',
                },
              },
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
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[minter]] [[contextAction]] [[pet]] for [[cost]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'minted',
                },
              },
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            minter,
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `Failed: [[minter]] [[contextAction]] a Fren Pet`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'minted',
                },
              },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Fren Pet',
            default: `[[user]] [[contextAction]] for [[pet]] to ${name}`,
            variables: {
              contextAction: {
                type: 'contextAction',
                value: 'set pet name',
              },
            },
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
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'wheel committed',
                },
              },
            },
          },
        };
      } else {
        transaction.context = {
          variables: {
            user,
          },
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'Fren Pet',
              default: `[[user]] [[contextAction]]`,
              variables: {
                contextAction: {
                  type: 'contextAction',
                  value: 'wheel committed',
                },
              },
            },
          },
        };
      }
      return transaction;
    }

    //case '0xdb006a75': {
    //  // redeem(uint256)
    //  // first argument is the petId
    //  return transaction;
    //}

    //// TODO - unknown
    //case '0x1f6a715d': {
    //  return transaction;
    //}

    //// TODO - unknown
    //case '0x4d578c93': {
    //  return transaction;
    //}

    //// TODO - unknown
    //// I think this is doing a simple transfer
    //case '0xf2832a48': {
    //  return transaction;
    //}

    default: {
      return transaction;
    }
  }
};

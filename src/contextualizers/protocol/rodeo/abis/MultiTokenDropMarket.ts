const abi = [
  {
    inputs: [
      { internalType: 'address payable', name: '_treasury', type: 'address' },
      { internalType: 'address', name: '_feth', type: 'address' },
      { internalType: 'address', name: '_worldsNft', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'DropMarketLibrary_General_Availability_Start_Time_Has_Expired',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DropMarketLibrary_Mint_Permission_Required',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DropMarketLibrary_Only_Callable_By_Collection_Admin',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'maxTime', type: 'uint256' }],
    name: 'DropMarketLibrary_Time_Too_Far_In_The_Future',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FETHNode_FETH_Address_Is_Not_A_Contract',
    type: 'error',
  },
  { inputs: [], name: 'FETHNode_Only_FETH_Can_Transfer_ETH', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'expectedValueAmount', type: 'uint256' },
    ],
    name: 'FethNode_Too_Much_Value_Provided',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FoundationTreasuryNode_Address_Is_Not_A_Contract',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Collection_Must_Be_ERC_1155',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'generalAvailabilityStartTime',
        type: 'uint256',
      },
    ],
    name: 'MultiTokenDropMarketFixedPriceSale_General_Access_Not_Open',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Must_Buy_At_Least_One_Token',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Must_Have_Available_Supply',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Payment_Address_Required',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Recipient_Cannot_Be_Zero_Address',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MultiTokenDropMarketFixedPriceSale_Sale_Terms_Not_Found',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'mintEndTime', type: 'uint256' }],
    name: 'MultiTokenDropMarketFixedPriceSale_Start_Time_Is_After_Mint_End_Time',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'existingSaleTermsId', type: 'uint256' },
    ],
    name: 'MultiTokenDropMarketFixedPriceSale_Token_Already_Listed_For_Sale',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'bits', type: 'uint8' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
  },
  {
    inputs: [],
    name: 'WorldsNftNode_Worlds_NFT_Is_Not_A_Contract',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'saleTermsId',
        type: 'uint256',
      },
    ],
    name: 'CancelSaleTerms',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'multiTokenContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'saleTermsId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pricePerQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address payable',
        name: 'creatorPaymentAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'generalAvailabilityStartTime',
        type: 'uint256',
      },
    ],
    name: 'ConfigureFixedPriceSale',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'invalidatedSaleTermsId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'newSaleTermsId',
        type: 'uint256',
      },
    ],
    name: 'InvalidateSaleTerms',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'saleTermsId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'referrer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokenQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'pricePerQuantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'creatorRevenue',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'worldCuratorRevenue',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'protocolFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'referrerReward',
        type: 'uint256',
      },
    ],
    name: 'MintFromFixedPriceSale',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawalToFETH',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'saleTermsId', type: 'uint256' }],
    name: 'cancelFixedPriceSale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'multiTokenContract', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'pricePerQuantity', type: 'uint256' },
      {
        internalType: 'address payable',
        name: 'creatorPaymentAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'generalAvailabilityStartTime',
        type: 'uint256',
      },
    ],
    name: 'createFixedPriceSale',
    outputs: [
      { internalType: 'uint256', name: 'saleTermsId', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFethAddress',
    outputs: [
      { internalType: 'address', name: 'fethAddress', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'saleTermsId', type: 'uint256' },
      { internalType: 'address payable', name: 'referrer', type: 'address' },
    ],
    name: 'getFixedPriceSale',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'multiTokenContract',
            type: 'address',
          },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'pricePerQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'quantityAvailableToMint',
            type: 'uint256',
          },
          {
            internalType: 'address payable',
            name: 'creatorPaymentAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'generalAvailabilityStartTime',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'mintEndTime', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'creatorRevenuePerQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'referrerRewardPerQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'worldCuratorRevenuePerQuantity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeePerQuantity',
            type: 'uint256',
          },
        ],
        internalType:
          'struct MultiTokenDropMarketFixedPriceSale.GetFixedPriceSaleResults',
        name: 'results',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFoundationTreasury',
    outputs: [
      {
        internalType: 'address payable',
        name: 'treasuryAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'pricePerQuantity', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenQuantity', type: 'uint256' },
    ],
    name: 'getRevenueDistributionForMint',
    outputs: [
      { internalType: 'uint256', name: 'creatorRevenue', type: 'uint256' },
      { internalType: 'uint256', name: 'protocolFee', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'nftContract', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'getSaleTermsForToken',
    outputs: [
      { internalType: 'uint256', name: 'saleTermsId', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWorldsNftAddress',
    outputs: [{ internalType: 'address', name: 'worldsNft', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'saleTermsId', type: 'uint256' },
      { internalType: 'uint256', name: 'tokenQuantity', type: 'uint256' },
      { internalType: 'address', name: 'tokenRecipient', type: 'address' },
      { internalType: 'address payable', name: 'referrer', type: 'address' },
    ],
    name: 'mintFromFixedPriceSale',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'saleTermsId', type: 'uint256' },
      { internalType: 'uint256', name: 'pricePerQuantity', type: 'uint256' },
      {
        internalType: 'address payable',
        name: 'creatorPaymentAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'generalAvailabilityStartTime',
        type: 'uint256',
      },
    ],
    name: 'updateFixedPriceSale',
    outputs: [
      { internalType: 'uint256', name: 'newSaleTermsId', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
] as const;

export default abi;

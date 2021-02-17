const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'uniswapRouter',
        type: 'address',
      },
      {
        internalType: 'uint128',
        name: 'limit',
        type: 'uint128',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserve',
        type: 'uint256',
      },
    ],
    name: 'TokensPurchased',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'seller',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eth',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'profit',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reserve',
        type: 'uint256',
      },
    ],
    name: 'TokensSold',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'numEth',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimeDeadline',
        type: 'uint256',
      },
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'numToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimeDeadline',
        type: 'uint256',
      },
    ],
    name: 'depositAndBuy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'epoch',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'numEth',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numTokensSold',
        type: 'uint256',
      },
    ],
    name: 'estimateReward',
    outputs: [
      {
        internalType: 'uint256',
        name: 'profitablePrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'avgBlock',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'htrs',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'vpc',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reserveLimit',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'numToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numEthLimit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimeDeadline',
        type: 'uint256',
      },
    ],
    name: 'sell',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'numToken',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numEthLimit',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'blockTimeDeadline',
        type: 'uint256',
      },
    ],
    name: 'sellAndWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'tokenPriceData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'ethSum',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'tokenSum',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'weightedBlockSum',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'latestBlock',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vnlContract',
    outputs: [
      {
        internalType: 'contract VanillaGovernanceToken',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'wethReserves',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
]

export default ABI

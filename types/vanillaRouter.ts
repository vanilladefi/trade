const ABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'uniswapRouter',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
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
    name: 'buy',
    outputs: [],
    stateMutability: 'payable',
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
        name: 'numEth',
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
    stateMutability: 'payable',
    type: 'receive',
  },
]

export default ABI

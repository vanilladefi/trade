/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { VanillaV1Uniswap02 } from "../VanillaV1Uniswap02";

export class VanillaV1Uniswap02__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    router: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VanillaV1Uniswap02> {
    return super.deploy(router, overrides || {}) as Promise<VanillaV1Uniswap02>;
  }
  getDeployTransaction(
    router: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(router, overrides || {});
  }
  attach(address: string): VanillaV1Uniswap02 {
    return super.attach(address) as VanillaV1Uniswap02;
  }
  connect(signer: Signer): VanillaV1Uniswap02__factory {
    return super.connect(signer) as VanillaV1Uniswap02__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VanillaV1Uniswap02 {
    return new Contract(address, _abi, signerOrProvider) as VanillaV1Uniswap02;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IPeripheryImmutableState",
        name: "router",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "allowed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "AllowanceExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "int256",
        name: "amountReceived",
        type: "int256",
      },
    ],
    name: "InvalidSwap",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidUniswapState",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidWethAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "NoTokenPositionFound",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "SlippageExceeded",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
      {
        internalType: "uint112",
        name: "balance",
        type: "uint112",
      },
    ],
    name: "TokenBalanceExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "TooManyTradesPerBlock",
    type: "error",
  },
  {
    inputs: [],
    name: "TradeExpired",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "invalidVersion",
        type: "address",
      },
    ],
    name: "UnapprovedMigrationTarget",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedCallback",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedDelegateCall",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedReentrantAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedValueSent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint24",
        name: "fee",
        type: "uint24",
      },
    ],
    name: "UninitializedUniswapPool",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongTradingParameters",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "amount0Delta",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "amount1Delta",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60e060405234801561001057600080fd5b506040516106e93803806106e983398101604081905261002f91610160565b806001600160a01b0316634aa4a4fc6040518163ffffffff1660e01b815260040160206040518083038186803b15801561006857600080fd5b505afa15801561007c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100a09190610160565b6001600160a01b031660a0816001600160a01b031660601b81525050806001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156100f557600080fd5b505afa158015610109573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061012d9190610160565b6001600160601b0319606091821b16608052309081901b60c052600080546001600160a01b03191690911790555061019b565b600060208284031215610171578081fd5b815161017c81610183565b9392505050565b6001600160a01b038116811461019857600080fd5b50565b60805160601c60a05160601c60c05160601c61051f6101ca60003960005050600050506000505061051f6000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063fa461e3314610030575b600080fd5b61004361003e366004610353565b610045565b005b6000546001600160a01b0316331461007057604051637ae3640d60e11b815260040160405180910390fd5b6000831280156100805750600084125b1561009e57604051631de3ccef60e01b815260040160405180910390fd5b600080600086136100b857846100b3876104b9565b6100c2565b856100c2866104b9565b90925090506000806100d6858701876103e6565b915091508060600151826100ea91906104a1565b60a082015160208301516040516370a0823160e01b81526001600160a01b0391821660048201529116906370a082319060240160206040518083038186803b15801561013557600080fd5b505afa158015610149573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061016d91906103ce565b10156101a15760608101516040516371c4efed60e01b81526004810191909152602481018490526044015b60405180910390fd5b80604001518411156101d757806040015184604051635492412b60e11b8152600401610198929190918252602082015260400190565b80516001600160a01b031630141561027557608081015160405163a9059cbb60e01b8152336004820152602481018690526001600160a01b039091169063a9059cbb90604401602060405180830381600087803b15801561023757600080fd5b505af115801561024b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061026f919061032c565b50610306565b608081015181516040516323b872dd60e01b81526001600160a01b039182166004820152336024820152604481018790529116906323b872dd90606401602060405180830381600087803b1580156102cc57600080fd5b505af11580156102e0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610304919061032c565b505b5050505050505050565b80356001600160a01b038116811461032757600080fd5b919050565b60006020828403121561033d578081fd5b8151801515811461034c578182fd5b9392505050565b60008060008060608587031215610368578283fd5b8435935060208501359250604085013567ffffffffffffffff8082111561038d578384fd5b818701915087601f8301126103a0578384fd5b8135818111156103ae578485fd5b8860208285010111156103bf578485fd5b95989497505060200194505050565b6000602082840312156103df578081fd5b5051919050565b60008082840360e08112156103f9578283fd5b8335925060c0601f198201121561040e578182fd5b5060405160c0810181811067ffffffffffffffff8211171561043e57634e487b7160e01b83526041600452602483fd5b60405261044d60208501610310565b815261045b60408501610310565b6020820152606084013560408201526080840135606082015261048060a08501610310565b608082015261049160c08501610310565b60a0820152809150509250929050565b600082198211156104b4576104b46104d3565b500190565b6000600160ff1b8214156104cf576104cf6104d3565b0390565b634e487b7160e01b600052601160045260246000fdfea26469706673582212205b6194de8ea132f2061e335ef066505e6dfedf57afbbbbe423b53d79dcbb2abb64736f6c63430008040033";

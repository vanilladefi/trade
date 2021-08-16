/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  VanillaV1Safelist01,
  VanillaV1Safelist01Interface,
} from "../VanillaV1Safelist01";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "safeListOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "UnauthorizedAccess",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "TokensAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "TokensRemoved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "approveNextVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isSafelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "added",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "removed",
        type: "address[]",
      },
    ],
    name: "modify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "nextVersion",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405161054038038061054083398101604081905261002f91610044565b60601b6001600160601b031916608052610072565b600060208284031215610055578081fd5b81516001600160a01b038116811461006b578182fd5b9392505050565b60805160601c6104aa6100966000396000818160e701526102b101526104aa6000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80630bafd60e1461005157806334567cf8146100815780634360aa8d146100b4578063be4443c0146100c9575b600080fd5b600154610064906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100a461008f366004610377565b60006020819052908152604090205460ff1681565b6040519015158152602001610078565b6100c76100c2366004610398565b6100dc565b005b6100c76100d7366004610377565b6102a6565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461012557604051631a27eac360e11b815260040160405180910390fd5b8280156101e65760005b818110156101ab57600160008088888581811061015c57634e487b7160e01b600052603260045260246000fd5b90506020020160208101906101719190610377565b6001600160a01b031681526020810191909152604001600020805460ff1916911515919091179055806101a38161044d565b91505061012f565b507f7d713019ad8a7d0879c2e785f8924ee9dd744ef744ec6b6d00391087054c5eb785856040516101dd929190610401565b60405180910390a15b81801561029e5760005b818110156102635760008086868481811061021b57634e487b7160e01b600052603260045260246000fd5b90506020020160208101906102309190610377565b6001600160a01b031681526020810191909152604001600020805460ff191690558061025b8161044d565b9150506101f0565b507fe102daee3529f9c698745d764bee5eeb856656a86a4ec6ab687e94cfb0edc1308484604051610295929190610401565b60405180910390a15b505050505050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146102ef57604051631a27eac360e11b815260040160405180910390fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b80356001600160a01b038116811461032857600080fd5b919050565b60008083601f84011261033e578182fd5b50813567ffffffffffffffff811115610355578182fd5b6020830191508360208260051b850101111561037057600080fd5b9250929050565b600060208284031215610388578081fd5b61039182610311565b9392505050565b600080600080604085870312156103ad578283fd5b843567ffffffffffffffff808211156103c4578485fd5b6103d08883890161032d565b909650945060208701359150808211156103e8578384fd5b506103f58782880161032d565b95989497509550505050565b60208082528181018390526000908460408401835b86811015610442576001600160a01b0361042f84610311565b1682529183019190830190600101610416565b509695505050505050565b600060001982141561046d57634e487b7160e01b81526011600452602481fd5b506001019056fea2646970667358221220fcc3a80eac67410b12df93b849f5d72a8722659bcb08bd28fefd8fd40a6c75b064736f6c63430008040033";

export class VanillaV1Safelist01__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    safeListOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VanillaV1Safelist01> {
    return super.deploy(
      safeListOwner,
      overrides || {}
    ) as Promise<VanillaV1Safelist01>;
  }
  getDeployTransaction(
    safeListOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(safeListOwner, overrides || {});
  }
  attach(address: string): VanillaV1Safelist01 {
    return super.attach(address) as VanillaV1Safelist01;
  }
  connect(signer: Signer): VanillaV1Safelist01__factory {
    return super.connect(signer) as VanillaV1Safelist01__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VanillaV1Safelist01Interface {
    return new utils.Interface(_abi) as VanillaV1Safelist01Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VanillaV1Safelist01 {
    return new Contract(address, _abi, signerOrProvider) as VanillaV1Safelist01;
  }
}

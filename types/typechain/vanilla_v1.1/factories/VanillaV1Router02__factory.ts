/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { VanillaV1Router02 } from "../VanillaV1Router02";

export class VanillaV1Router02__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _peripheryState: string,
    _safeList: string,
    _migrationState: string,
    _v1temp: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VanillaV1Router02> {
    return super.deploy(
      _peripheryState,
      _safeList,
      _migrationState,
      _v1temp,
      overrides || {}
    ) as Promise<VanillaV1Router02>;
  }
  getDeployTransaction(
    _peripheryState: string,
    _safeList: string,
    _migrationState: string,
    _v1temp: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _peripheryState,
      _safeList,
      _migrationState,
      _v1temp,
      overrides || {}
    );
  }
  attach(address: string): VanillaV1Router02 {
    return super.attach(address) as VanillaV1Router02;
  }
  connect(signer: Signer): VanillaV1Router02__factory {
    return super.connect(signer) as VanillaV1Router02__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VanillaV1Router02 {
    return new Contract(address, _abi, signerOrProvider) as VanillaV1Router02;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IPeripheryImmutableState",
        name: "_peripheryState",
        type: "address",
      },
      {
        internalType: "contract IVanillaV1Safelist01",
        name: "_safeList",
        type: "address",
      },
      {
        internalType: "contract IVanillaV1MigrationState",
        name: "_migrationState",
        type: "address",
      },
      {
        internalType: "contract VanillaV1API01",
        name: "_v1temp",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eth",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "eth",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "profit",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "TokensSold",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numEth",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockTimeDeadline",
        type: "uint256",
      },
    ],
    name: "buy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockTimeDeadline",
        type: "uint256",
      },
    ],
    name: "depositAndBuy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "epoch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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
      {
        internalType: "uint256",
        name: "numEth",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numTokensSold",
        type: "uint256",
      },
    ],
    name: "estimateReward",
    outputs: [
      {
        internalType: "uint256",
        name: "profitablePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "avgBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "htrs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "safeList",
    outputs: [
      {
        internalType: "contract IVanillaV1Safelist01",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numEthLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockTimeDeadline",
        type: "uint256",
      },
    ],
    name: "sell",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "numToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numEthLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "blockTimeDeadline",
        type: "uint256",
      },
    ],
    name: "sellAndWithdraw",
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
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokenPriceData",
    outputs: [
      {
        internalType: "uint256",
        name: "ethSum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenSum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "weightedBlockSum",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "latestBlock",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
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
  {
    inputs: [],
    name: "vnlContract",
    outputs: [
      {
        internalType: "contract IVanillaV1Token02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x6101406040523480156200001257600080fd5b506040516200353c3803806200353c833981016040819052620000359162000311565b83806001600160a01b0316634aa4a4fc6040518163ffffffff1660e01b815260040160206040518083038186803b1580156200007057600080fd5b505afa15801562000085573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000ab9190620002eb565b6001600160a01b031660a0816001600160a01b031660601b81525050806001600160a01b031663c45a01556040518163ffffffff1660e01b815260040160206040518083038186803b1580156200010157600080fd5b505afa15801562000116573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200013c9190620002eb565b6001600160601b0319606091821b16608052309081901b60c052600080546001600160a01b0319169091179055506040805163cab8924960e01b81529051829184916001600160a01b0384169163cab89249916004808301926020929190829003018186803b158015620001af57600080fd5b505afa158015620001c4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001ea9190620002eb565b604051620001f890620002dd565b6001600160a01b03928316815291166020820152604001604051809103906000f0801580156200022c573d6000803e3d6000fd5b506001600160a01b0316610100816001600160a01b031660601b81525050806001600160a01b031663900cf0cf6040518163ffffffff1660e01b815260040160206040518083038186803b1580156200028457600080fd5b505afa15801562000299573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620002bf919062000378565b60e05250505060601b6001600160601b0319166101205250620003aa565b6115af8062001f8d83390190565b600060208284031215620002fd578081fd5b81516200030a8162000391565b9392505050565b6000806000806080858703121562000327578283fd5b8451620003348162000391565b6020860151909450620003478162000391565b60408601519093506200035a8162000391565b60608601519092506200036d8162000391565b939692955090935050565b6000602082840312156200038a578081fd5b5051919050565b6001600160a01b0381168114620003a757600080fd5b50565b60805160601c60a05160601c60c05160601c60e0516101005160601c6101205160601c611b076200048660003960006101a901526000818161028a0152610bd70152600081816102150152818161056501528181610b8c01528181610caf0152610cf301526000818161108e015281816110cf015281816113ef0152818161142e015261146f01526000818160a50152818161038f0152818161064001528181610df901528181610e3501528181610e6a01528181610eca01528181610f060152610f34015260008181610dd70152610ea80152611b076000f3fe6080604052600436106100955760003560e01c8063900cf0cf11610059578063900cf0cf1461020357806392cdbac514610245578063ba322a9214610265578063cab8924914610278578063fa461e33146102ac57600080fd5b80631622dbe4146100e7578063193b33a11461010757806338eea386146101275780636b333a60146101975780637c30be4e146101e357600080fd5b366100e257336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146100e057634e487b7160e01b600052600160045260246000fd5b005b600080fd5b3480156100f357600080fd5b506100e06101023660046117eb565b6102cc565b34801561011357600080fd5b506100e06101223660046117eb565b610328565b34801561013357600080fd5b5061017261014236600461173a565b60016020818152600093845260408085209091529183529120805491810154600282015460039092015490919084565b6040805194855260208501939093529183015260608201526080015b60405180910390f35b3480156101a357600080fd5b506101cb7f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b03909116815260200161018e565b3480156101ef57600080fd5b506101726101fe366004611772565b6104a0565b34801561020f57600080fd5b506102377f000000000000000000000000000000000000000000000000000000000000000081565b60405190815260200161018e565b34801561025157600080fd5b506100e06102603660046117eb565b6105a9565b6100e06102733660046117b7565b6105fd565b34801561028457600080fd5b506101cb7f000000000000000000000000000000000000000000000000000000000000000081565b3480156102b857600080fd5b506100e06102c736600461186f565b6106c7565b804281101560405180604001604052806002815260200161623160f01b815250906103135760405162461bcd60e51b815260040161030a9190611985565b60405180910390fd5b506103213333878787610944565b5050505050565b804281101560405180604001604052806002815260200161623160f01b815250906103665760405162461bcd60e51b815260040161030a9190611985565b5060006103763330888888610a57565b604051632e1a7d4d60e01b8152600481018290529091507f0000000000000000000000000000000000000000000000000000000000000000906001600160a01b03821690632e1a7d4d90602401600060405180830381600087803b1580156103dd57600080fd5b505af11580156103f1573d6000803e3d6000fd5b5050604080516000808252602082019283905293503392508591610415919061192e565b60006040518083038185875af1925050503d8060008114610452576040519150601f19603f3d011682016040523d82523d6000602084013e610457565b606091505b505090508060405180604001604052806002815260200161311960f11b815250906104955760405162461bcd60e51b815260040161030a9190611985565b505050505050505050565b6001600160a01b03808516600090815260016020818152604080842094881684529381528383209182015484518086019095526002855261188d60f21b918501919091529192839283928392909161050b5760405162461bcd60e51b815260040161030a9190611985565b506001810154815461051d90886119fb565b61052791906119db565b94508060010154816002015461053d91906119db565b9350848711156105945760006105538689611a42565b905061055e85610ca2565b935061058c7f0000000000000000000000000000000000000000000000000000000000000000864384610d4d565b92505061059d565b60009250600091505b50945094509450949050565b804281101560405180604001604052806002815260200161623160f01b815250906105e75760405162461bcd60e51b815260040161030a9190611985565b506105f53333878787610a57565b505050505050565b804281101560405180604001604052806002815260200161623160f01b8152509061063b5760405162461bcd60e51b815260040161030a9190611985565b5060007f000000000000000000000000000000000000000000000000000000000000000090506000349050816001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b1580156106a157600080fd5b505af11580156106b5573d6000803e3d6000fd5b50505050506105f53330888489610944565b60008080806106d8858701876116e8565b600054939750919550935091506001600160a01b031633146106f957600080fd5b600088131561081d578261070c88611a89565b101561074a5760405162461bcd60e51b815260206004820152600d60248201526c5631553a20736c69707061676560981b604482015260640161030a565b6001600160a01b0384163014156107e25760405163a9059cbb60e01b8152336004820152602481018990526001600160a01b0383169063a9059cbb906044015b602060405180830381600087803b1580156107a457600080fd5b505af11580156107b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107dc9190611825565b5061093a565b6040516323b872dd60e01b81526001600160a01b038581166004830152336024830152604482018a90528316906323b872dd9060640161078a565b600087131561093a578261083089611a89565b101561086e5760405162461bcd60e51b815260206004820152600d60248201526c5631553a20736c69707061676560981b604482015260640161030a565b6001600160a01b0384163014156108b25760405163a9059cbb60e01b8152336004820152602481018890526001600160a01b0382169063a9059cbb9060440161078a565b6040516323b872dd60e01b81526001600160a01b038581166004830152336024830152604482018990528216906323b872dd90606401602060405180830381600087803b15801561090257600080fd5b505af1158015610916573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104959190611825565b5050505050505050565b6001600160a01b038086166000908152600160209081526040808320938716835292815290829020600381015483518085019094526002845261623360f01b92840192909252919043116109ab5760405162461bcd60e51b815260040161030a9190611985565b5043600382015560006109c385858589610bb8610dcd565b82549091506109d39085906119c3565b825560018201546109e59082906119c3565b60018301556109f481436119fb565b8260020154610a0391906119c3565b600283015560408051858152602081018390526001600160a01b0387169133917f6faf93231a456e552dbc9961f58d9713ee4f2e69d15f1975b050ef0911053a7b910160405180910390a350505050505050565b6001600160a01b0380861660009081526001602090815260408083209387168352928152828220600381015484518086019095526002855261623360f01b928501929092529192904311610abe5760405162461bcd60e51b815260040161030a9190611985565b504360038201556000610ad6868686610bb88b610e9e565b60018301548354919250600091610aed90886119fb565b610af791906119db565b9050600083600101548460020154610b0f91906119db565b90506000878560010154610b239190611a42565b90506000838511610b35576000610b3f565b610b3f8486611a42565b9050610b548660000154838860010154610f59565b865560028601546001870154610b6c91908490610f59565b6002870155600186018290556000610b82600190565b15610c3c57610bb37f0000000000000000000000000000000000000000000000000000000000000000854385610d4d565b90508015610c3c576040516340c10f1960e01b8152336004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906340c10f1990604401600060405180830381600087803b158015610c2357600080fd5b505af1158015610c37573d6000803e3d6000fd5b505050505b604080518b815260208101889052908101839052606081018290526001600160a01b038c169033907f34f38731fae2221a0127cde5769237f08a73e828efb7c9a19e4c6fa171ff763d9060800160405180910390a350939b9a5050505050505050505050565b600043821480610cd157507f000000000000000000000000000000000000000000000000000000000000000043145b15610cde57506000919050565b6000610cea8343611a42565b90506000610d187f000000000000000000000000000000000000000000000000000000000000000043611a42565b9050610d2481806119fb565b610d2e83806119fb565b610d3b90620f42406119fb565b610d4591906119db565b949350505050565b600081610d5c57506000610d45565b83831415610d6c57506000610d45565b84831415610d7c57506000610d45565b6000610d888585611a42565b90506000610d968786611a42565b90508080610da484806119fb565b610dae90876119fb565b610db891906119db565b610dc291906119db565b979650505050505050565b6000806000610e1e7f0000000000000000000000000000000000000000000000000000000000000000897f000000000000000000000000000000000000000000000000000000000000000087610f66565b9092509050308115610e6057610e598387838b8b8e7f0000000000000000000000000000000000000000000000000000000000000000611086565b9350610e92565b610e8f8387838b8b7f00000000000000000000000000000000000000000000000000000000000000008f611426565b93505b50505095945050505050565b6000806000610eef7f0000000000000000000000000000000000000000000000000000000000000000897f000000000000000000000000000000000000000000000000000000000000000088610f66565b9092509050308115610f2a57610e598382878b8b8e7f0000000000000000000000000000000000000000000000000000000000000000611426565b610e8f8382878b8b7f00000000000000000000000000000000000000000000000000000000000000008f611086565b600081610d3b84866119fb565b60006001600160a01b03808416908516108581610fbc57604080516001600160a01b03808816602083015288169181019190915262ffffff85166060820152608001604051602081830303815290604052610ff7565b604080516001600160a01b03808916602083015287169181019190915262ffffff851660608201526080016040516020818303038152906040525b805160209182012060405161106293927fe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b5491016001600160f81b0319815260609390931b6bffffffffffffffffffffffff191660018401526015830191909152603582015260550190565b6040516020818303038152906040528051906020012060001c915094509492505050565b6000805488907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b039081169116146110c457600080fd5b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146110f957600080fd5b600080546001600160a01b0319166001600160a01b038381169190911782556040516370a0823160e01b81528982166004820152908616906370a082319060240160206040518083038186803b15801561115257600080fd5b505afa158015611166573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061118a91906118ea565b905060006001600160a01b038b1663128acb088a838b6111bf600173fffd8963efd1fc6a506488495d951d5263988d26611a1a565b8f8d8d8d6040516020016111fc94939291906001600160a01b03948516815260208101939093529083166040830152909116606082015260800190565b6040516020818303038152906040526040518663ffffffff1660e01b815260040161122b95949392919061194a565b6040805180830381600087803b15801561124457600080fd5b505af1158015611258573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061127c919061184c565b509050600081126112cf5760405162461bcd60e51b815260206004820152601d60248201527f5631553a20696e636f7272656374207377617020646972656374696f6e000000604482015260640161030a565b6112d881611a89565b93508684101561131f5760405162461bcd60e51b81526020600482015260126024820152712b18aa9d103ab734b9bbb0b81032b93937b960711b604482015260640161030a565b61132984836119c3565b6040516370a0823160e01b81526001600160a01b038b811660048301528816906370a08231906024015b60206040518083038186803b15801561136b57600080fd5b505afa15801561137f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a391906118ea565b146113dd5760405162461bcd60e51b815260206004820152600a602482015269158c554e881b1a5b5a5d60b21b604482015260640161030a565b5050600080546001600160a01b0319167f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031617905550979650505050505050565b6000805488907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0390811691161461146457600080fd5b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461149957600080fd5b600080546001600160a01b0319166001600160a01b038381169190911782556040516370a0823160e01b81528982166004820152908516906370a082319060240160206040518083038186803b1580156114f257600080fd5b505afa158015611506573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061152a91906118ea565b905060006001600160a01b038b1663128acb088a60018b6115506401000276a383611998565b8f8d8d8d60405160200161158d94939291906001600160a01b03948516815260208101939093529083166040830152909116606082015260800190565b6040516020818303038152906040526040518663ffffffff1660e01b81526004016115bc95949392919061194a565b6040805180830381600087803b1580156115d557600080fd5b505af11580156115e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061160d919061184c565b915050600081126116605760405162461bcd60e51b815260206004820152601d60248201527f5631553a20696e636f7272656374207377617020646972656374696f6e000000604482015260640161030a565b61166981611a89565b9350868410156116b05760405162461bcd60e51b81526020600482015260126024820152712b18aa9d103ab734b9bbb0b81032b93937b960711b604482015260640161030a565b6116ba84836119c3565b6040516370a0823160e01b81526001600160a01b038b811660048301528716906370a0823190602401611353565b600080600080608085870312156116fd578384fd5b843561170881611ab9565b935060208501359250604085013561171f81611ab9565b9150606085013561172f81611ab9565b939692955090935050565b6000806040838503121561174c578182fd5b823561175781611ab9565b9150602083013561176781611ab9565b809150509250929050565b60008060008060808587031215611787578384fd5b843561179281611ab9565b935060208501356117a281611ab9565b93969395505050506040820135916060013590565b6000806000606084860312156117cb578283fd5b83356117d681611ab9565b95602085013595506040909401359392505050565b60008060008060808587031215611800578384fd5b843561180b81611ab9565b966020860135965060408601359560600135945092505050565b600060208284031215611836578081fd5b81518015158114611845578182fd5b9392505050565b6000806040838503121561185e578182fd5b505080516020909101519092909150565b60008060008060608587031215611884578384fd5b8435935060208501359250604085013567ffffffffffffffff808211156118a9578384fd5b818701915087601f8301126118bc578384fd5b8135818111156118ca578485fd5b8860208285010111156118db578485fd5b95989497505060200194505050565b6000602082840312156118fb578081fd5b5051919050565b6000815180845261191a816020860160208601611a59565b601f01601f19169290920160200192915050565b60008251611940818460208701611a59565b9190910192915050565b6001600160a01b0386811682528515156020830152604082018590528316606082015260a060808201819052600090610dc290830184611902565b6020815260006118456020830184611902565b60006001600160a01b038281168482168083038211156119ba576119ba611aa3565b01949350505050565b600082198211156119d6576119d6611aa3565b500190565b6000826119f657634e487b7160e01b81526012600452602481fd5b500490565b6000816000190483118215151615611a1557611a15611aa3565b500290565b60006001600160a01b0383811690831681811015611a3a57611a3a611aa3565b039392505050565b600082821015611a5457611a54611aa3565b500390565b60005b83811015611a74578181015183820152602001611a5c565b83811115611a83576000848401525b50505050565b6000600160ff1b821415611a9f57611a9f611aa3565b0390565b634e487b7160e01b600052601160045260246000fd5b6001600160a01b0381168114611ace57600080fd5b5056fea2646970667358221220688c5647b1844be31b55aef83a4c98e44cc758fab355a65697dfc3ba4a9ad6be64736f6c6343000804003360a06040523480156200001157600080fd5b50604051620015af380380620015af833981016040819052620000349162000188565b81816040518060400160405280600781526020016656616e696c6c6160c81b8152506040518060400160405280600381526020016215939360ea1b81525081600390805190602001906200008a929190620000e2565b508051620000a0906004906020840190620000e2565b5050600580546001600160a01b039485166001600160a01b03199182161790915560068054939094169216919091179091555050503360601b6080526200021c565b828054620000f090620001c6565b90600052602060002090601f0160209004810192826200011457600085556200015f565b82601f106200012f57805160ff19168380011785556200015f565b828001600101855582156200015f579182015b828111156200015f57825182559160200191906001019062000142565b506200016d92915062000171565b5090565b5b808211156200016d576000815560010162000172565b600080604083850312156200019b578182fd5b8251620001a88162000203565b6020840151909250620001bb8162000203565b809150509250929050565b600181811c90821680620001db57607f821691505b60208210811415620001fd57634e487b7160e01b600052602260045260246000fd5b50919050565b6001600160a01b03811681146200021957600080fd5b50565b60805160601c6113746200023b600039600061097c01526113746000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806339509351116100975780639a3483fe116100665780639a3483fe14610206578063a457c2d714610230578063a9059cbb14610243578063dd62ed3e1461025657600080fd5b806339509351146101af57806340c10f19146101c257806370a08231146101d557806395d89b41146101fe57600080fd5b806318160ddd116100d357806318160ddd1461016657806321f06ea01461017857806323b872dd1461018d578063313ce567146101a057600080fd5b806306fdde03146100fa578063095ea7b31461011857806312a2f7921461013b575b600080fd5b61010261028f565b60405161010f9190611255565b60405180910390f35b61012b6101263660046110b6565b610321565b604051901515815260200161010f565b60055461014e906001600160a01b031681565b6040516001600160a01b03909116815260200161010f565b6002545b60405190815260200161010f565b61018b6101863660046110df565b610337565b005b61012b61019b36600461107b565b610879565b604051600c815260200161010f565b61012b6101bd3660046110b6565b61092a565b61018b6101d03660046110b6565b610961565b61016a6101e3366004611028565b6001600160a01b031660009081526020819052604090205490565b6101026109d2565b6102196102143660046110df565b6109e1565b60408051921515835290151560208301520161010f565b61012b61023e3660046110b6565b610b7f565b61012b6102513660046110b6565b610c1a565b61016a610264366004611049565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606003805461029e906112d7565b80601f01602080910402602001604051908101604052809291908181526020018280546102ca906112d7565b80156103175780601f106102ec57610100808354040283529160200191610317565b820191906000526020600020905b8154815290600101906020018083116102fa57829003601f168201915b5050505050905090565b600061032e338484610c27565b50600192915050565b600560009054906101000a90046001600160a01b03166001600160a01b0316633965c0836040518163ffffffff1660e01b815260040160206040518083038186803b15801561038557600080fd5b505afa158015610399573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103bd91906111d7565b67ffffffffffffffff1642106104135760405162461bcd60e51b8152602060048201526016602482015275158c50ce8818dbdb9d995c9cda5bdb8818db1bdcd95960521b60448201526064015b60405180910390fd5b6006546040516370a0823160e01b81523360048201526000916001600160a01b0316906370a082319060240160206040518083038186803b15801561045757600080fd5b505afa15801561046b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061048f91906111bf565b9050600081116104d05760405162461bcd60e51b815260206004820152600c60248201526b5631433a2062616c616e636560a01b604482015260640161040a565b6006546040516370a0823160e01b81523060048201819052916000916001600160a01b03909116906370a082319060240160206040518083038186803b15801561051957600080fd5b505afa15801561052d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061055191906111bf565b6006546040516323b872dd60e01b81523360048201526001600160a01b038581166024830152604482018790529293509116906323b872dd90606401602060405180830381600087803b1580156105a757600080fd5b505af11580156105bb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105df919061119f565b506105ea83826112a8565b6006546040516370a0823160e01b81526001600160a01b038581166004830152909116906370a082319060240160206040518083038186803b15801561062f57600080fd5b505afa158015610643573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061066791906111bf565b146106ab5760405162461bcd60e51b81526020600482015260146024820152735631433a20667265657a65722062616c616e636560601b604482015260640161040a565b6006546040516370a0823160e01b81523360048201526001600160a01b03909116906370a082319060240160206040518083038186803b1580156106ee57600080fd5b505afa158015610702573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061072691906111bf565b156107735760405162461bcd60e51b815260206004820152601760248201527f5631433a20636f6e76657273696f6e2062616c616e6365000000000000000000604482015260640161040a565b6005546040516315f4599960e01b81526001600160a01b03909116906315f45999906107a7908790339088906004016111ff565b60206040518083038186803b1580156107bf57600080fd5b505afa1580156107d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107f7919061119f565b6108305760405162461bcd60e51b815260206004820152600a6024820152692b18a19d10383937b7b360b11b604482015260640161040a565b61083a3384610d4b565b60408051338152602081018590527fc81072229ec6e4e2cb32e6d9fcfa0d4f4ac0b521ac84083648501b3e38274187910160405180910390a150505050565b6000610886848484610d55565b6001600160a01b03841660009081526001602090815260408083203384529091529020548281101561090b5760405162461bcd60e51b815260206004820152602860248201527f45524332303a207472616e7366657220616d6f756e74206578636565647320616044820152676c6c6f77616e636560c01b606482015260840161040a565b61091f853361091a86856112c0565b610c27565b506001949350505050565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909161032e91859061091a9086906112a8565b604080518082019091526002815261633160f01b60208201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031633146109c35760405162461bcd60e51b815260040161040a9190611255565b506109ce8282610f2d565b5050565b60606004805461029e906112d7565b6006546040516370a0823160e01b8152336004820152600091829182916001600160a01b0316906370a082319060240160206040518083038186803b158015610a2957600080fd5b505afa158015610a3d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a6191906111bf565b6005546040516315f4599960e01b81529192506001600160a01b0316906315f4599990610a96908790339086906004016111ff565b60206040518083038186803b158015610aae57600080fd5b505afa158015610ac2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ae6919061119f565b9250600081118015610b775750600654604051636eb1769f60e11b815233600482015230602482015282916001600160a01b03169063dd62ed3e9060440160206040518083038186803b158015610b3c57600080fd5b505afa158015610b50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b7491906111bf565b10155b915050915091565b3360009081526001602090815260408083206001600160a01b038616845290915281205482811015610c015760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b606482015260840161040a565b610c10338561091a86856112c0565b5060019392505050565b600061032e338484610d55565b6001600160a01b038316610c895760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161040a565b6001600160a01b038216610cea5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161040a565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6109ce8282610f2d565b6001600160a01b038316610db95760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b606482015260840161040a565b6001600160a01b038216610e1b5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161040a565b6001600160a01b03831660009081526020819052604090205481811015610e935760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b606482015260840161040a565b610e9d82826112c0565b6001600160a01b038086166000908152602081905260408082209390935590851681529081208054849290610ed39084906112a8565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610f1f91815260200190565b60405180910390a350505050565b6001600160a01b038216610f835760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161040a565b8060026000828254610f9591906112a8565b90915550506001600160a01b03821660009081526020819052604081208054839290610fc29084906112a8565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b80356001600160a01b038116811461102357600080fd5b919050565b600060208284031215611039578081fd5b6110428261100c565b9392505050565b6000806040838503121561105b578081fd5b6110648361100c565b91506110726020840161100c565b90509250929050565b60008060006060848603121561108f578081fd5b6110988461100c565b92506110a66020850161100c565b9150604084013590509250925092565b600080604083850312156110c8578182fd5b6110d18361100c565b946020939093013593505050565b600060208083850312156110f1578182fd5b823567ffffffffffffffff80821115611108578384fd5b818501915085601f83011261111b578384fd5b81358181111561112d5761112d611328565b8060051b604051601f19603f8301168101818110858211171561115257611152611328565b604052828152858101935084860182860187018a1015611170578788fd5b8795505b83861015611192578035855260019590950194938601938601611174565b5098975050505050505050565b6000602082840312156111b0578081fd5b81518015158114611042578182fd5b6000602082840312156111d0578081fd5b5051919050565b6000602082840312156111e8578081fd5b815167ffffffffffffffff81168114611042578182fd5b606080825284519082018190526000906020906080840190828801845b828110156112385781518452928401929084019060010161121c565b5050506001600160a01b0395909516908301525060400152919050565b6000602080835283518082850152825b8181101561128157858101830151858201604001528201611265565b818111156112925783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156112bb576112bb611312565b500190565b6000828210156112d2576112d2611312565b500390565b600181811c908216806112eb57607f821691505b6020821081141561130c57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fdfea26469706673582212207794fcfdf6bd8f2133af5ae20e8b287155dbf7b8d61e7068096f0598a57b1d8c64736f6c63430008040033";

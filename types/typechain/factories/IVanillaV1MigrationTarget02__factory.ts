/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IVanillaV1MigrationTarget02,
  IVanillaV1MigrationTarget02Interface,
} from "../IVanillaV1MigrationTarget02";

const _abi = [
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
    name: "migrateState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IVanillaV1MigrationTarget02__factory {
  static readonly abi = _abi;
  static createInterface(): IVanillaV1MigrationTarget02Interface {
    return new utils.Interface(_abi) as IVanillaV1MigrationTarget02Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IVanillaV1MigrationTarget02 {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IVanillaV1MigrationTarget02;
  }
}

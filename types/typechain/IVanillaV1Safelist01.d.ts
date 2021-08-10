/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface IVanillaV1Safelist01Interface extends ethers.utils.Interface {
  functions: {
    "isSafelisted(address)": FunctionFragment;
    "nextVersion()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "isSafelisted",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "nextVersion",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "isSafelisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextVersion",
    data: BytesLike
  ): Result;

  events: {
    "TokensAdded(address[])": EventFragment;
    "TokensRemoved(address[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "TokensAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokensRemoved"): EventFragment;
}

export class IVanillaV1Safelist01 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IVanillaV1Safelist01Interface;

  functions: {
    isSafelisted(token: string, overrides?: CallOverrides): Promise<[boolean]>;

    nextVersion(overrides?: CallOverrides): Promise<[string]>;
  };

  isSafelisted(token: string, overrides?: CallOverrides): Promise<boolean>;

  nextVersion(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    isSafelisted(token: string, overrides?: CallOverrides): Promise<boolean>;

    nextVersion(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    TokensAdded(
      tokens?: null
    ): TypedEventFilter<[string[]], { tokens: string[] }>;

    TokensRemoved(
      tokens?: null
    ): TypedEventFilter<[string[]], { tokens: string[] }>;
  };

  estimateGas: {
    isSafelisted(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    nextVersion(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    isSafelisted(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextVersion(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}

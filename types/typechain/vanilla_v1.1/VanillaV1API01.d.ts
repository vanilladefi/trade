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
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface VanillaV1API01Interface extends ethers.utils.Interface {
  functions: {
    "buy(address,uint256,uint256,uint256)": FunctionFragment;
    "depositAndBuy(address,uint256,uint256)": FunctionFragment;
    "epoch()": FunctionFragment;
    "estimateReward(address,address,uint256,uint256)": FunctionFragment;
    "isTokenRewarded(address)": FunctionFragment;
    "reserveLimit()": FunctionFragment;
    "sell(address,uint256,uint256,uint256)": FunctionFragment;
    "sellAndWithdraw(address,uint256,uint256,uint256)": FunctionFragment;
    "tokenPriceData(address,address)": FunctionFragment;
    "vnlContract()": FunctionFragment;
    "wethReserves(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "buy",
    values: [string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "depositAndBuy",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "epoch", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "estimateReward",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isTokenRewarded",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "reserveLimit",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sell",
    values: [string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sellAndWithdraw",
    values: [string, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenPriceData",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "vnlContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "wethReserves",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "buy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositAndBuy",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "epoch", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "estimateReward",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTokenRewarded",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reserveLimit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sell", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sellAndWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenPriceData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vnlContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "wethReserves",
    data: BytesLike
  ): Result;

  events: {};
}

export class VanillaV1API01 extends BaseContract {
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

  interface: VanillaV1API01Interface;

  functions: {
    buy(
      token: string,
      numEth: BigNumberish,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    depositAndBuy(
      token: string,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    epoch(overrides?: CallOverrides): Promise<[BigNumber]>;

    estimateReward(
      owner: string,
      token: string,
      numEth: BigNumberish,
      numTokensSold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        profitablePrice: BigNumber;
        avgBlock: BigNumber;
        htrs: BigNumber;
        vpc: BigNumber;
        reward: BigNumber;
      }
    >;

    isTokenRewarded(
      token: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    reserveLimit(overrides?: CallOverrides): Promise<[BigNumber]>;

    sell(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sellAndWithdraw(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    tokenPriceData(
      owner: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        ethSum: BigNumber;
        tokenSum: BigNumber;
        weightedBlockSum: BigNumber;
        latestBlock: BigNumber;
      }
    >;

    vnlContract(overrides?: CallOverrides): Promise<[string]>;

    wethReserves(
      token: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  buy(
    token: string,
    numEth: BigNumberish,
    numToken: BigNumberish,
    blockTimeDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  depositAndBuy(
    token: string,
    numToken: BigNumberish,
    blockTimeDeadline: BigNumberish,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  epoch(overrides?: CallOverrides): Promise<BigNumber>;

  estimateReward(
    owner: string,
    token: string,
    numEth: BigNumberish,
    numTokensSold: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      profitablePrice: BigNumber;
      avgBlock: BigNumber;
      htrs: BigNumber;
      vpc: BigNumber;
      reward: BigNumber;
    }
  >;

  isTokenRewarded(token: string, overrides?: CallOverrides): Promise<boolean>;

  reserveLimit(overrides?: CallOverrides): Promise<BigNumber>;

  sell(
    token: string,
    numToken: BigNumberish,
    numEthLimit: BigNumberish,
    blockTimeDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sellAndWithdraw(
    token: string,
    numToken: BigNumberish,
    numEthLimit: BigNumberish,
    blockTimeDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  tokenPriceData(
    owner: string,
    token: string,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      ethSum: BigNumber;
      tokenSum: BigNumber;
      weightedBlockSum: BigNumber;
      latestBlock: BigNumber;
    }
  >;

  vnlContract(overrides?: CallOverrides): Promise<string>;

  wethReserves(token: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    buy(
      token: string,
      numEth: BigNumberish,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    depositAndBuy(
      token: string,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    epoch(overrides?: CallOverrides): Promise<BigNumber>;

    estimateReward(
      owner: string,
      token: string,
      numEth: BigNumberish,
      numTokensSold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        profitablePrice: BigNumber;
        avgBlock: BigNumber;
        htrs: BigNumber;
        vpc: BigNumber;
        reward: BigNumber;
      }
    >;

    isTokenRewarded(token: string, overrides?: CallOverrides): Promise<boolean>;

    reserveLimit(overrides?: CallOverrides): Promise<BigNumber>;

    sell(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    sellAndWithdraw(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    tokenPriceData(
      owner: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        ethSum: BigNumber;
        tokenSum: BigNumber;
        weightedBlockSum: BigNumber;
        latestBlock: BigNumber;
      }
    >;

    vnlContract(overrides?: CallOverrides): Promise<string>;

    wethReserves(token: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    buy(
      token: string,
      numEth: BigNumberish,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    depositAndBuy(
      token: string,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    epoch(overrides?: CallOverrides): Promise<BigNumber>;

    estimateReward(
      owner: string,
      token: string,
      numEth: BigNumberish,
      numTokensSold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTokenRewarded(
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    reserveLimit(overrides?: CallOverrides): Promise<BigNumber>;

    sell(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sellAndWithdraw(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    tokenPriceData(
      owner: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vnlContract(overrides?: CallOverrides): Promise<BigNumber>;

    wethReserves(token: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    buy(
      token: string,
      numEth: BigNumberish,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    depositAndBuy(
      token: string,
      numToken: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    epoch(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    estimateReward(
      owner: string,
      token: string,
      numEth: BigNumberish,
      numTokensSold: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTokenRewarded(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    reserveLimit(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sell(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sellAndWithdraw(
      token: string,
      numToken: BigNumberish,
      numEthLimit: BigNumberish,
      blockTimeDeadline: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    tokenPriceData(
      owner: string,
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    vnlContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wethReserves(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}

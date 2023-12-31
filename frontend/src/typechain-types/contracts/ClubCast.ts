/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export type ClubStruct = {
  clubId: PromiseOrValue<string>;
  owner: PromiseOrValue<string>;
  governanceAddress: PromiseOrValue<string>;
  erc721Address: PromiseOrValue<string>;
  maxMember: PromiseOrValue<BigNumberish>;
};

export type ClubStructOutput = [string, string, string, string, BigNumber] & {
  clubId: string;
  owner: string;
  governanceAddress: string;
  erc721Address: string;
  maxMember: BigNumber;
};

export declare namespace ClubCast {
  export type EpisodeStruct = {
    id: PromiseOrValue<string>;
    publisher: PromiseOrValue<string>;
    createdAt: PromiseOrValue<string>;
    title: PromiseOrValue<string>;
    description: PromiseOrValue<string>;
    ipfsUrl: PromiseOrValue<string>;
    likes: PromiseOrValue<BigNumberish>;
    dislikes: PromiseOrValue<BigNumberish>;
  };

  export type EpisodeStructOutput = [
    string,
    string,
    string,
    string,
    string,
    string,
    BigNumber,
    BigNumber
  ] & {
    id: string;
    publisher: string;
    createdAt: string;
    title: string;
    description: string;
    ipfsUrl: string;
    likes: BigNumber;
    dislikes: BigNumber;
  };
}

export interface ClubCastInterface extends utils.Interface {
  functions: {
    "DislikeEpisode(string,string)": FunctionFragment;
    "clubMembers(string,uint256)": FunctionFragment;
    "clubs(string)": FunctionFragment;
    "createClub(string,address,address)": FunctionFragment;
    "episodes(string,uint256)": FunctionFragment;
    "getClubEpisodes(string,address)": FunctionFragment;
    "getClubErc721(string)": FunctionFragment;
    "getClubGovernance(string)": FunctionFragment;
    "getClubInfo(string)": FunctionFragment;
    "getClubMembers(string)": FunctionFragment;
    "getClubOwner(string)": FunctionFragment;
    "getEpisodeCount(string)": FunctionFragment;
    "getUserClubIds(address)": FunctionFragment;
    "joinClub(string)": FunctionFragment;
    "likeEpisode(string,string)": FunctionFragment;
    "owner()": FunctionFragment;
    "publishEpisode(string,string,string,string,string,string)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "tipContentCreator(uint256,string)": FunctionFragment;
    "tippingToken()": FunctionFragment;
    "tips(string)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "userClubIds(address,uint256)": FunctionFragment;
    "userClubTokenMappings(address,string)": FunctionFragment;
    "withdrawTips(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "DislikeEpisode"
      | "clubMembers"
      | "clubs"
      | "createClub"
      | "episodes"
      | "getClubEpisodes"
      | "getClubErc721"
      | "getClubGovernance"
      | "getClubInfo"
      | "getClubMembers"
      | "getClubOwner"
      | "getEpisodeCount"
      | "getUserClubIds"
      | "joinClub"
      | "likeEpisode"
      | "owner"
      | "publishEpisode"
      | "renounceOwnership"
      | "tipContentCreator"
      | "tippingToken"
      | "tips"
      | "transferOwnership"
      | "userClubIds"
      | "userClubTokenMappings"
      | "withdrawTips"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "DislikeEpisode",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "clubMembers",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "clubs",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createClub",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "episodes",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubEpisodes",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubErc721",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubGovernance",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubInfo",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubMembers",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getClubOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getEpisodeCount",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getUserClubIds",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "joinClub",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "likeEpisode",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "publishEpisode",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tipContentCreator",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "tippingToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tips",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "userClubIds",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "userClubTokenMappings",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawTips",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "DislikeEpisode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "clubMembers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "clubs", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createClub", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "episodes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getClubEpisodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClubErc721",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClubGovernance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClubInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClubMembers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClubOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEpisodeCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUserClubIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "joinClub", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "likeEpisode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publishEpisode",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tipContentCreator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tippingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tips", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userClubIds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "userClubTokenMappings",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawTips",
    data: BytesLike
  ): Result;

  events: {
    "NewClub(string,address,address,address)": EventFragment;
    "NewEpisode(string,string,address,string)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Tipped(address,string,uint256)": EventFragment;
    "Withdrawn(address,string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "NewClub"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NewEpisode"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Tipped"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawn"): EventFragment;
}

export interface NewClubEventObject {
  clubId: string;
  creator: string;
  erc721Address: string;
  governanceAddress: string;
}
export type NewClubEvent = TypedEvent<
  [string, string, string, string],
  NewClubEventObject
>;

export type NewClubEventFilter = TypedEventFilter<NewClubEvent>;

export interface NewEpisodeEventObject {
  episodeId: string;
  clubId: string;
  publisher: string;
  ipfsUrl: string;
}
export type NewEpisodeEvent = TypedEvent<
  [string, string, string, string],
  NewEpisodeEventObject
>;

export type NewEpisodeEventFilter = TypedEventFilter<NewEpisodeEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface TippedEventObject {
  tipper: string;
  clubId: string;
  amount: BigNumber;
}
export type TippedEvent = TypedEvent<
  [string, string, BigNumber],
  TippedEventObject
>;

export type TippedEventFilter = TypedEventFilter<TippedEvent>;

export interface WithdrawnEventObject {
  creator: string;
  clubId: string;
  amount: BigNumber;
}
export type WithdrawnEvent = TypedEvent<
  [string, string, BigNumber],
  WithdrawnEventObject
>;

export type WithdrawnEventFilter = TypedEventFilter<WithdrawnEvent>;

export interface ClubCast extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ClubCastInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    DislikeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    clubMembers(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    clubs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, BigNumber] & {
        clubId: string;
        owner: string;
        governanceAddress: string;
        erc721Address: string;
        maxMember: BigNumber;
      }
    >;

    createClub(
      _clubId: PromiseOrValue<string>,
      _erc721Address: PromiseOrValue<string>,
      _governanceAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    episodes(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string, string, BigNumber, BigNumber] & {
        id: string;
        publisher: string;
        createdAt: string;
        title: string;
        description: string;
        ipfsUrl: string;
        likes: BigNumber;
        dislikes: BigNumber;
      }
    >;

    getClubEpisodes(
      _clubId: PromiseOrValue<string>,
      _requester: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[ClubCast.EpisodeStructOutput[]]>;

    getClubErc721(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getClubGovernance(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getClubInfo(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[ClubStructOutput]>;

    getClubMembers(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    getClubOwner(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getEpisodeCount(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getUserClubIds(
      _userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[], BigNumber[]]>;

    joinClub(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    likeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    publishEpisode(
      _clubId: PromiseOrValue<string>,
      _episodeId: PromiseOrValue<string>,
      _createdAt: PromiseOrValue<string>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _ipfsUrl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tipContentCreator(
      _amount: PromiseOrValue<BigNumberish>,
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tippingToken(overrides?: CallOverrides): Promise<[string]>;

    tips(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    userClubIds(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    userClubTokenMappings(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    withdrawTips(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  DislikeEpisode(
    clubId: PromiseOrValue<string>,
    episodeId: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  clubMembers(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  clubs(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string, BigNumber] & {
      clubId: string;
      owner: string;
      governanceAddress: string;
      erc721Address: string;
      maxMember: BigNumber;
    }
  >;

  createClub(
    _clubId: PromiseOrValue<string>,
    _erc721Address: PromiseOrValue<string>,
    _governanceAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  episodes(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, string, string, string, BigNumber, BigNumber] & {
      id: string;
      publisher: string;
      createdAt: string;
      title: string;
      description: string;
      ipfsUrl: string;
      likes: BigNumber;
      dislikes: BigNumber;
    }
  >;

  getClubEpisodes(
    _clubId: PromiseOrValue<string>,
    _requester: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<ClubCast.EpisodeStructOutput[]>;

  getClubErc721(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getClubGovernance(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getClubInfo(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<ClubStructOutput>;

  getClubMembers(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string[]>;

  getClubOwner(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getEpisodeCount(
    _clubId: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getUserClubIds(
    _userAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[string[], BigNumber[]]>;

  joinClub(
    _clubId: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  likeEpisode(
    clubId: PromiseOrValue<string>,
    episodeId: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  publishEpisode(
    _clubId: PromiseOrValue<string>,
    _episodeId: PromiseOrValue<string>,
    _createdAt: PromiseOrValue<string>,
    _title: PromiseOrValue<string>,
    _description: PromiseOrValue<string>,
    _ipfsUrl: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tipContentCreator(
    _amount: PromiseOrValue<BigNumberish>,
    _clubId: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tippingToken(overrides?: CallOverrides): Promise<string>;

  tips(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  userClubIds(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  userClubTokenMappings(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  withdrawTips(
    _clubId: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    DislikeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    clubMembers(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    clubs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, BigNumber] & {
        clubId: string;
        owner: string;
        governanceAddress: string;
        erc721Address: string;
        maxMember: BigNumber;
      }
    >;

    createClub(
      _clubId: PromiseOrValue<string>,
      _erc721Address: PromiseOrValue<string>,
      _governanceAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    episodes(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, string, string, string, BigNumber, BigNumber] & {
        id: string;
        publisher: string;
        createdAt: string;
        title: string;
        description: string;
        ipfsUrl: string;
        likes: BigNumber;
        dislikes: BigNumber;
      }
    >;

    getClubEpisodes(
      _clubId: PromiseOrValue<string>,
      _requester: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<ClubCast.EpisodeStructOutput[]>;

    getClubErc721(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getClubGovernance(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getClubInfo(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<ClubStructOutput>;

    getClubMembers(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string[]>;

    getClubOwner(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getEpisodeCount(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserClubIds(
      _userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string[], BigNumber[]]>;

    joinClub(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    likeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    publishEpisode(
      _clubId: PromiseOrValue<string>,
      _episodeId: PromiseOrValue<string>,
      _createdAt: PromiseOrValue<string>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _ipfsUrl: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    tipContentCreator(
      _amount: PromiseOrValue<BigNumberish>,
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    tippingToken(overrides?: CallOverrides): Promise<string>;

    tips(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    userClubIds(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    userClubTokenMappings(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawTips(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "NewClub(string,address,address,address)"(
      clubId?: PromiseOrValue<string> | null,
      creator?: PromiseOrValue<string> | null,
      erc721Address?: null,
      governanceAddress?: null
    ): NewClubEventFilter;
    NewClub(
      clubId?: PromiseOrValue<string> | null,
      creator?: PromiseOrValue<string> | null,
      erc721Address?: null,
      governanceAddress?: null
    ): NewClubEventFilter;

    "NewEpisode(string,string,address,string)"(
      episodeId?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      publisher?: null,
      ipfsUrl?: null
    ): NewEpisodeEventFilter;
    NewEpisode(
      episodeId?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      publisher?: null,
      ipfsUrl?: null
    ): NewEpisodeEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Tipped(address,string,uint256)"(
      tipper?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      amount?: null
    ): TippedEventFilter;
    Tipped(
      tipper?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      amount?: null
    ): TippedEventFilter;

    "Withdrawn(address,string,uint256)"(
      creator?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      amount?: null
    ): WithdrawnEventFilter;
    Withdrawn(
      creator?: PromiseOrValue<string> | null,
      clubId?: PromiseOrValue<string> | null,
      amount?: null
    ): WithdrawnEventFilter;
  };

  estimateGas: {
    DislikeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    clubMembers(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    clubs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createClub(
      _clubId: PromiseOrValue<string>,
      _erc721Address: PromiseOrValue<string>,
      _governanceAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    episodes(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubEpisodes(
      _clubId: PromiseOrValue<string>,
      _requester: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubErc721(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubGovernance(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubInfo(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubMembers(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getClubOwner(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getEpisodeCount(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getUserClubIds(
      _userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    joinClub(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    likeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    publishEpisode(
      _clubId: PromiseOrValue<string>,
      _episodeId: PromiseOrValue<string>,
      _createdAt: PromiseOrValue<string>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _ipfsUrl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tipContentCreator(
      _amount: PromiseOrValue<BigNumberish>,
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tippingToken(overrides?: CallOverrides): Promise<BigNumber>;

    tips(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    userClubIds(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    userClubTokenMappings(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    withdrawTips(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    DislikeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    clubMembers(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    clubs(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createClub(
      _clubId: PromiseOrValue<string>,
      _erc721Address: PromiseOrValue<string>,
      _governanceAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    episodes(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubEpisodes(
      _clubId: PromiseOrValue<string>,
      _requester: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubErc721(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubGovernance(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubInfo(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubMembers(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getClubOwner(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getEpisodeCount(
      _clubId: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getUserClubIds(
      _userAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    joinClub(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    likeEpisode(
      clubId: PromiseOrValue<string>,
      episodeId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    publishEpisode(
      _clubId: PromiseOrValue<string>,
      _episodeId: PromiseOrValue<string>,
      _createdAt: PromiseOrValue<string>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _ipfsUrl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tipContentCreator(
      _amount: PromiseOrValue<BigNumberish>,
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tippingToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tips(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    userClubIds(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    userClubTokenMappings(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    withdrawTips(
      _clubId: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
  login: ReturnedUser;
  requestedBlocks: Array<Maybe<TRequestedDanglingBlock>>;
  myRequestedBlocks: Array<Maybe<TRequestedDanglingBlock>>;
  publicLedger: Array<Maybe<TPublicLedger>>;
};


export type QueryLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']>;
  singUp: ReturnedUserSignup;
  requestDanglingBlock: TRequestedDanglingBlock;
  acceptDeclineBlock?: Maybe<TAcceptDeclineCount>;
  shareBlock: TSharedBlockResponse;
};


export type MutationSingUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
};


export type MutationRequestDanglingBlockArgs = {
  requestBlockData: TRequestDanglingBlock;
};


export type MutationAcceptDeclineBlockArgs = {
  acceptDenyParams: TAcceptDenyParams;
};


export type MutationShareBlockArgs = {
  shareBlockArgs: TShareBlockArgs;
};

export type Subscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['Boolean']>;
};

export type TSignupArgs = {
  __typename?: 'TSignupArgs';
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password: Scalars['String'];
};

export type TLoginArgs = {
  __typename?: 'TLoginArgs';
  email: Scalars['String'];
  password: Scalars['String'];
};

export type ReturnedUser = {
  __typename?: 'ReturnedUser';
  _id: Scalars['ID'];
  publicKey: Scalars['String'];
  token: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
};

export type ReturnedUserSignup = {
  __typename?: 'ReturnedUserSignup';
  _id: Scalars['ID'];
  publicKey: Scalars['String'];
  token: Scalars['String'];
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  middleName?: Maybe<Scalars['String']>;
  privateKey: Scalars['String'];
};


export type TRequestedDanglingBlock = {
  __typename?: 'TRequestedDanglingBlock';
  _id: Scalars['ID'];
  user?: Maybe<ReturnedUser>;
  requestAt: Scalars['DateTime'];
  message: Scalars['String'];
  acceptCount: Scalars['Int'];
  rejectCount: Scalars['Int'];
};

export type TAcceptDeclineCount = {
  __typename?: 'TAcceptDeclineCount';
  acceptCount: Scalars['Int'];
  rejectCount: Scalars['Int'];
};

export type TRequestDanglingBlock = {
  cipherKeyForTheMessage: Scalars['String'];
  message: Scalars['String'];
};

export type TAcceptDenyParams = {
  blockId: Scalars['ID'];
  isAccept?: Maybe<Scalars['Boolean']>;
};

export type TPublicLedger = {
  __typename?: 'TPublicLedger';
  _id: Scalars['ID'];
  data: Scalars['String'];
  prevHash: Scalars['String'];
  hash: Scalars['String'];
  timeStamp: Scalars['DateTime'];
  nounce: Scalars['Int'];
};

export type TSharedBlockResponse = {
  __typename?: 'TSharedBlockResponse';
  shareStatus: Scalars['Boolean'];
  message: Scalars['String'];
};

export type TShareBlockArgs = {
  blockId: Scalars['ID'];
  recipientUserId: Scalars['ID'];
  cipherTextOfBlock: Scalars['String'];
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}




export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  TSignupArgs: ResolverTypeWrapper<TSignupArgs>;
  TLoginArgs: ResolverTypeWrapper<TLoginArgs>;
  ReturnedUser: ResolverTypeWrapper<ReturnedUser>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  ReturnedUserSignup: ResolverTypeWrapper<ReturnedUserSignup>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  TRequestedDanglingBlock: ResolverTypeWrapper<TRequestedDanglingBlock>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  TAcceptDeclineCount: ResolverTypeWrapper<TAcceptDeclineCount>;
  TRequestDanglingBlock: TRequestDanglingBlock;
  TAcceptDenyParams: TAcceptDenyParams;
  TPublicLedger: ResolverTypeWrapper<TPublicLedger>;
  TSharedBlockResponse: ResolverTypeWrapper<TSharedBlockResponse>;
  TShareBlockArgs: TShareBlockArgs;
  CacheControlScope: CacheControlScope;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  Boolean: Scalars['Boolean'];
  String: Scalars['String'];
  Mutation: {};
  Subscription: {};
  TSignupArgs: TSignupArgs;
  TLoginArgs: TLoginArgs;
  ReturnedUser: ReturnedUser;
  ID: Scalars['ID'];
  ReturnedUserSignup: ReturnedUserSignup;
  DateTime: Scalars['DateTime'];
  TRequestedDanglingBlock: TRequestedDanglingBlock;
  Int: Scalars['Int'];
  TAcceptDeclineCount: TAcceptDeclineCount;
  TRequestDanglingBlock: TRequestDanglingBlock;
  TAcceptDenyParams: TAcceptDenyParams;
  TPublicLedger: TPublicLedger;
  TSharedBlockResponse: TSharedBlockResponse;
  TShareBlockArgs: TShareBlockArgs;
  Upload: Scalars['Upload'];
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  login?: Resolver<ResolversTypes['ReturnedUser'], ParentType, ContextType, RequireFields<QueryLoginArgs, 'email' | 'password'>>;
  requestedBlocks?: Resolver<Array<Maybe<ResolversTypes['TRequestedDanglingBlock']>>, ParentType, ContextType>;
  myRequestedBlocks?: Resolver<Array<Maybe<ResolversTypes['TRequestedDanglingBlock']>>, ParentType, ContextType>;
  publicLedger?: Resolver<Array<Maybe<ResolversTypes['TPublicLedger']>>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  singUp?: Resolver<ResolversTypes['ReturnedUserSignup'], ParentType, ContextType, RequireFields<MutationSingUpArgs, 'email' | 'password' | 'firstName' | 'lastName'>>;
  requestDanglingBlock?: Resolver<ResolversTypes['TRequestedDanglingBlock'], ParentType, ContextType, RequireFields<MutationRequestDanglingBlockArgs, 'requestBlockData'>>;
  acceptDeclineBlock?: Resolver<Maybe<ResolversTypes['TAcceptDeclineCount']>, ParentType, ContextType, RequireFields<MutationAcceptDeclineBlockArgs, 'acceptDenyParams'>>;
  shareBlock?: Resolver<ResolversTypes['TSharedBlockResponse'], ParentType, ContextType, RequireFields<MutationShareBlockArgs, 'shareBlockArgs'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _?: SubscriptionResolver<Maybe<ResolversTypes['Boolean']>, "_", ParentType, ContextType>;
};

export type TSignupArgsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TSignupArgs'] = ResolversParentTypes['TSignupArgs']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TLoginArgsResolvers<ContextType = any, ParentType extends ResolversParentTypes['TLoginArgs'] = ResolversParentTypes['TLoginArgs']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ReturnedUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReturnedUser'] = ResolversParentTypes['ReturnedUser']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ReturnedUserSignupResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReturnedUserSignup'] = ResolversParentTypes['ReturnedUserSignup']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publicKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  privateKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type TRequestedDanglingBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['TRequestedDanglingBlock'] = ResolversParentTypes['TRequestedDanglingBlock']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['ReturnedUser']>, ParentType, ContextType>;
  requestAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  acceptCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rejectCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TAcceptDeclineCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['TAcceptDeclineCount'] = ResolversParentTypes['TAcceptDeclineCount']> = {
  acceptCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  rejectCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TPublicLedgerResolvers<ContextType = any, ParentType extends ResolversParentTypes['TPublicLedger'] = ResolversParentTypes['TPublicLedger']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  prevHash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timeStamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  nounce?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TSharedBlockResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['TSharedBlockResponse'] = ResolversParentTypes['TSharedBlockResponse']> = {
  shareStatus?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TSignupArgs?: TSignupArgsResolvers<ContextType>;
  TLoginArgs?: TLoginArgsResolvers<ContextType>;
  ReturnedUser?: ReturnedUserResolvers<ContextType>;
  ReturnedUserSignup?: ReturnedUserSignupResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  TRequestedDanglingBlock?: TRequestedDanglingBlockResolvers<ContextType>;
  TAcceptDeclineCount?: TAcceptDeclineCountResolvers<ContextType>;
  TPublicLedger?: TPublicLedgerResolvers<ContextType>;
  TSharedBlockResponse?: TSharedBlockResponseResolvers<ContextType>;
  Upload?: GraphQLScalarType;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

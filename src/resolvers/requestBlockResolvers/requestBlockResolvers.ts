import { acceptDeclineBlock, requestDanglingBlock } from './mutation';
import { requestedBlocks } from './query';

import { TRequestDanglingBlock, TAcceptDenyParams, QueryRequestedBlocksArgs } from 'src/generated/graphql';
import { Context } from 'src/context';

export default {
  Query: {
    requestedBlocks: (
      parent: any, args: QueryRequestedBlocksArgs, context: Context,
    ) => requestedBlocks(args, context),
    myRequestedBlocks: (
      parent: any, args: any, context: Context,
    ) => requestedBlocks({ isUserOnly: true }, context),
  },
  Mutation: {
    requestDanglingBlock: (
      parent: any, args: { requestBlockData: TRequestDanglingBlock }, context: Context,
    ) => requestDanglingBlock(args, context),
    acceptDeclineBlock: (
      parent: any, args: {acceptDenyParams: TAcceptDenyParams}, context: Context,
    ) => acceptDeclineBlock(args, context),
  },
};

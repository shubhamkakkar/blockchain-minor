import { acceptDeclineBlock, requestDanglingBlock } from './mutation';
import { requestedBlocks } from './query';
import { TRequestDanglingBlock, TAcceptDenyParams } from '../../generated/graphql';

export default {
  Query: {
    requestedBlocks: (parent: any, args: any, context: any) => requestedBlocks(context),
    myRequestedBlocks: (parent: any, args: any, context: any) => requestedBlocks(context, true),
  },
  Mutation: {
    requestDanglingBlock: (
      parent: any, args: { requestBlockData: TRequestDanglingBlock }, context: any,
    ) => requestDanglingBlock(args, context),
    acceptDeclineBlock: (
      parent: any, args: {acceptDenyParams: TAcceptDenyParams}, context: any,
    ) => acceptDeclineBlock(args, context),
  },
};

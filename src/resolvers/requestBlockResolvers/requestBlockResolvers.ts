import { requestDanglingBlock } from './mutation';
import { requestedBlocks } from './query';

export default {
  Query: {
    requestedBlocks: (parent: any, args: any, context: any) => requestedBlocks(context),
    myRequestedBlocks: (parent: any, args: any, context: any) => requestedBlocks(context, true),
  },
  Mutation: {
    requestDanglingBlock: (
      parent: any, args: any, context: any,
    ) => requestDanglingBlock(args, context),
  },
};

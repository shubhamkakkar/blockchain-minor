import { publicLedger, sharedBlocks, receivedBlocks } from './query';
import { shareBlock } from './mutation';
import { TShareBlockArgs } from '../../generated/graphql';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: any) => publicLedger(context),
    sharedBlocks: (parent: any, args: any, context: any) => sharedBlocks(context),
    receivedBlocks: (parent: any, args: any, context: any) => receivedBlocks(context),
  },
  Mutation: {
    shareBlock: (
      parent: any, args: { shareBlockArgs: TShareBlockArgs }, context: any,
    ) => shareBlock(args, context),
  },
};

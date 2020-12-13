import { publicLedger, sharedBlocks } from './query';
import { shareBlock } from './mutation';
import { TShareBlockArgs } from '../../generated/graphql';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: any) => publicLedger(context),
    sharedBlocks: (parent: any, args: any, context: any) => sharedBlocks(context),
  },
  Mutation: {
    shareBlock: (
      parent: any, args: { shareBlockArgs: TShareBlockArgs }, context: any,
    ) => shareBlock(args, context),
  },
};

import {
  publicLedger, sharedBlocks, receivedBlocks, receivedBlock, myBlock,
} from './query';
import { shareBlock } from './mutation';

import { MyBlockArgs, ReceivedBlockArgs, TShareBlockArgs } from 'src/generated/graphql';
import { Context } from 'src/context';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: Context) => publicLedger(context),
    sharedBlocks: (parent: any, args: any, context: Context) => sharedBlocks(context),
    receivedBlocks: (parent: any, args: any, context: Context) => receivedBlocks(context),
    receivedBlock: (
      parent: any,
      { receivedBlockArgs }: { receivedBlockArgs: ReceivedBlockArgs },
      context: Context,
    ) => receivedBlock(receivedBlockArgs, context),
    myBlocks: (parent: any, args: any, context: Context) => publicLedger(context, true),
    myBlock: (
      parent: any, { myBlockArgs }: { myBlockArgs: MyBlockArgs }, context: Context,
    ) => myBlock(myBlockArgs, context),
  },
  Mutation: {
    shareBlock: (
      parent: any, args: { shareBlockArgs: TShareBlockArgs }, context: Context,
    ) => shareBlock(args, context),
  },
};

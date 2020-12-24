import {
  publicLedger, sharedBlocks, receivedBlocks, receivedBlock, myBlock,
} from './query';
import { shareBlock } from './mutation';

import { MyBlockArgs, ReceivedBlockArgs, TShareBlockArgs } from 'src/generated/graphql';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: any) => publicLedger(context),
    sharedBlocks: (parent: any, args: any, context: any) => sharedBlocks(context),
    receivedBlocks: (parent: any, args: any, context: any) => receivedBlocks(context),
    receivedBlock: (
      parent: any, { receivedBlockArgs }: { receivedBlockArgs: ReceivedBlockArgs }, context: any,
    ) => receivedBlock(receivedBlockArgs, context),
    myBlocks: (parent: any, args: any, context: any) => publicLedger(context, true),
    myBlock: (
      parent: any, { myBlockArgs }: { myBlockArgs: MyBlockArgs }, context: any,
    ) => myBlock(myBlockArgs, context),
  },
  Mutation: {
    shareBlock: (
      parent: any, args: { shareBlockArgs: TShareBlockArgs }, context: any,
    ) => shareBlock(args, context),
  },
};

import {
  publicLedger, sharedBlocks, receivedBlocks, receivedBlock,
} from './query';
import { shareBlock } from './mutation';
import { ReceivedBlockArgs, TShareBlockArgs } from '../../generated/graphql';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: any) => publicLedger(context),
    sharedBlocks: (parent: any, args: any, context: any) => sharedBlocks(context),
    receivedBlocks: (parent: any, args: any, context: any) => receivedBlocks(context),
    receivedBlock: (
      parent: any, { receivedBlockArgs }: { receivedBlockArgs: ReceivedBlockArgs }, context: any,
    ) => receivedBlock(receivedBlockArgs, context),
  },
  Mutation: {
    shareBlock: (
      parent: any, args: { shareBlockArgs: TShareBlockArgs }, context: any,
    ) => shareBlock(args, context),
  },
};

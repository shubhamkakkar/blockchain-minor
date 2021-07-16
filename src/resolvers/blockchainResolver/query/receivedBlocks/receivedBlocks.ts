import { GraphQLError } from 'graphql';

import userHash from 'src/utis/userHash/userHash';
import BlockModel from 'src/models/BlockModel';
import { ReceivedBlock } from 'src/generated/graphql';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';

interface IReceivedBlock extends ReceivedBlock {
  ownerId: string
}

export default async function receivedBlocks(
  { req: context, redisClient, customRedisGet }: Context,
) {
  try {
    if (context.user) {
      try {
        // const cachedMyReceivedBlocks = await customRedisGet(REDIS_KEYS.MY_RECEIVED_BLOCKS);
        // if (cachedMyReceivedBlocks) {
        //   return cachedMyReceivedBlocks;
        // }
        const blocks = await BlockModel.find(
          {
            'shared.recipientUser': context.user?._id,
            ownerId: { $ne: context.user?._id },
          },
          { 'shared.sharedAt': 1, ownerId: 1 },
        ).lean() as unknown as IReceivedBlock;
        if (blocks) {
          // @ts-ignore
          for (const block of blocks) {
            block.sharedBy = await userHash(block.ownerId);
            block.sharedAt = block.shared[0].sharedAt;
          }
          redisClient.set(REDIS_KEYS.MY_RECEIVED_BLOCKS, JSON.stringify(blocks));
          return blocks;
        }
        return new GraphQLError('Either the block does not exists, or it is not shared with you');
      } catch (e) {
        errorHandler('receivedBlocks', e);
      }
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('receivedBlocks', e);
  }
}

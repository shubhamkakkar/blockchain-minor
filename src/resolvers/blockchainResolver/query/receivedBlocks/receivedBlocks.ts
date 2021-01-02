import { GraphQLError } from 'graphql';

import userHash from 'src/utis/userHash/userHash';
import BlockModel from 'src/models/BlockModel';
import { ReceivedBlock } from 'src/generated/graphql';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';

interface IReceivedBlock extends ReceivedBlock {
  ownerId: string
}

export default async function receivedBlocks({ req: context, redisClient }: Context) {
  try {
    if (context.user) {
      return redisClient.get(
        REDIS_KEYS.MY_RECEIVED_BLOCKS, async (er, cachedMyReceivedBlocks) => {
          if (cachedMyReceivedBlocks) {
            return JSON.parse(cachedMyReceivedBlocks);
          }
          const blocks = await BlockModel.find(
            {
              'shared.recipientUser.email': context.user?.email,
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
        },
      );
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    console.log('Internal server error receivedBlocks e()', e);
    throw new GraphQLError('Internal server error receivedBlocks e()', e);
  }
}

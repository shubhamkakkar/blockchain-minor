import { GraphQLError } from 'graphql';

import BlockModel from 'src/models/BlockModel';
import { SharedBlock } from 'src/generated/graphql';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function sharedBlocks({ req: context, redisClient, customRedisGet }: Context) {
  if (context.user) {
    try {
      const cachedMySharedBlocks = await customRedisGet(REDIS_KEYS.MY_SHARED_BLOCKS);
      if (cachedMySharedBlocks) {
        return cachedMySharedBlocks;
      }
      const blocks = await BlockModel.find(
        { 'shared.0': { $exists: true }, ownerId: context.user?._id },
        { shared: 1, _id: 0 },
      ).lean() as { shared: SharedBlock[] }[];
      const allSharedBlocks:SharedBlock[] = [];
      blocks.forEach((block) => {
        allSharedBlocks.push(...block.shared);
      });
      redisClient.set(REDIS_KEYS.MY_SHARED_BLOCKS, JSON.stringify(allSharedBlocks));
      return allSharedBlocks;
    } catch (e) {
      return errorHandler('sharedBlocks', e);
    }
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

import { GraphQLError } from 'graphql';

import BlockModel from 'src/models/BlockModel';
import { SharedBlock } from 'src/generated/graphql';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';

export default async function sharedBlocks({ req: context, redisClient }: Context) {
  if (context.user) {
    return redisClient.get(REDIS_KEYS.MY_SHARED_BLOCKS, async (er, cachedMySharedBlocks) => {
      if (cachedMySharedBlocks) {
        return JSON.parse(cachedMySharedBlocks);
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
    });
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

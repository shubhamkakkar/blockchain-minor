import { GraphQLError } from 'graphql';

import BlockModel from 'src/models/BlockModel';
import { SharedBlock, User } from 'src/generated/graphql';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import userHash from 'src/utis/userHash/userHash';

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
      )
        .select('shared')
        .lean() as unknown as { shared: SharedBlock[] }[];

      const allSharedBlocks: any[] = [];
      for (const { shared } of blocks) {
        const sharedBlock = shared[0];
        sharedBlock.recipientUser = await userHash(sharedBlock.recipientUser as any) as User;
        console.log({ sharedBlock });
        allSharedBlocks.push(sharedBlock);
      }
      redisClient.set(REDIS_KEYS.MY_SHARED_BLOCKS, JSON.stringify(allSharedBlocks));
      return allSharedBlocks;
    } catch (e) {
      return errorHandler('sharedBlocks', e);
    }
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

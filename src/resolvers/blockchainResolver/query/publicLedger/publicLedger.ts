import { GraphQLError } from 'graphql';
import { FilterQuery } from 'mongoose';

import BlockModel from 'src/models/BlockModel';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';

export default async function publicLedger(
  { req: context, redisClient }: Context,
  myEntries = false,
) {
  if (context.user) {
    const condition:FilterQuery<any> = {};
    const redisKey = myEntries ? 'MY_ENTRIES' : 'ALL_ENTRIES';

    return redisClient.get(REDIS_KEYS[redisKey], async (er, cachedPublicLedger) => {
      if (cachedPublicLedger) {
        return JSON.parse(cachedPublicLedger);
      }
      if (myEntries) {
        condition.ownerId = context.user?._id;
      }
      const blocks = await BlockModel
        .find(condition, {
          data: 1, ownerId: 1, shared: 1, createdAt: 1,
        })
        .populate({
          path: 'shared',
          populate: 'recipientUser',
        }).lean();

      redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(blocks));
      return blocks;
    });
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

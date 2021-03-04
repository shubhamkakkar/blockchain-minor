import { GraphQLError } from 'graphql';
import { FilterQuery } from 'mongoose';

import BlockModel from 'src/models/BlockModel';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function publicLedger(
  { req: context, redisClient, customRedisGet }: Context,
  myEntries = false,
) {
  if (context.user) {
    const condition:FilterQuery<any> = {};
    const redisKey = myEntries ? 'MY_ENTRIES' : 'ALL_ENTRIES';
    try {
      const cachedPublicLedger = await customRedisGet(REDIS_KEYS[redisKey]);
      if (cachedPublicLedger) {
        return cachedPublicLedger;
      }
      if (myEntries) {
        condition.ownerId = context.user?._id;
      }
      const blocks = await BlockModel
        .find(condition)
        .select('-nounce-timeStamp')
        .populate({
          path: 'shared',
          populate: 'recipientUser',
        })
        .sort([['createdAt', 'descending']]);
      redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(blocks));
      return blocks;
    } catch (e) {
      return errorHandler('publicLedger', e);
    }
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

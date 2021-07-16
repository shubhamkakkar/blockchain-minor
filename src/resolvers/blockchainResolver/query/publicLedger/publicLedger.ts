import { GraphQLError } from 'graphql';
import { FilterQuery } from 'mongoose';

import BlockModel from 'src/models/BlockModel';
import { Context } from 'src/context';
import { REDIS_KEYS, USER_ROLE_TYPE } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import userHash from 'src/utis/userHash/userHash';

export default async function publicLedger(
  { req: context, redisClient, customRedisGet }: Context,
  myEntries = false,
) {
  if (context.user) {
    const isAdmin = context.user?.role === USER_ROLE_TYPE.ADMIN;
    const condition:FilterQuery<any> = {};
    const redisKey = isAdmin ? 'ALL_ENTRIES_ADMIN' : 'ALL_ENTRIES';
    try {
      if (!myEntries) {
        // const cachedPublicLedger = await customRedisGet(REDIS_KEYS[redisKey]);
        // if (cachedPublicLedger) {
        //   return cachedPublicLedger;
        // }
      } else {
        condition.ownerId = context.user?._id;
      }
      const blocks = await BlockModel
        .find(condition)
        .select('-nounce-timeStamp-prevHash')
        .populate({
          path: 'shared',
          populate: 'recipientUser',
        })
        .sort([['createdAt', 'descending']]);
      if (isAdmin && !myEntries) {
        const modifiedBlock = [];
        for (const block of blocks) {
          const objectifiedBlock = block.toObject();
          objectifiedBlock.ownerProfile = await userHash(objectifiedBlock.ownerId, false);
          modifiedBlock.push(objectifiedBlock);
        }
        redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(modifiedBlock));
        return modifiedBlock;
      }

      if (!myEntries) redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(blocks));
      return blocks;
    } catch (e) {
      return errorHandler('publicLedger', e);
    }
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

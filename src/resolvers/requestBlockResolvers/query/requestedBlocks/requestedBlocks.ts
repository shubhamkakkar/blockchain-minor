import { GraphQLError } from 'graphql';

import RequestBlockModel from 'src/models/RequestBlockModel';
import userHash from 'src/utis/userHash/userHash';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function requestedBlocks(
  { req: context, redisClient, customRedisGet }: Context, isUserOnly = false,
) {
  try {
    if (context.user) {
      const redisKey = isUserOnly ? 'MY_REQUESTED_BLOCKS' : 'REQUESTED_BLOCKS';
      const cachedRequestedBlocks = await customRedisGet(REDIS_KEYS[redisKey]);
      if (cachedRequestedBlocks) {
        return cachedRequestedBlocks;
      }
      const searchCondition = isUserOnly ? { userId: { $in: [context.user?._id] } } : {};
      const requestBlocks = await RequestBlockModel.find(searchCondition);
      let modifiedRequestedBlocks = [];
      if (isUserOnly) {
        modifiedRequestedBlocks = requestBlocks.map(
          (requestedBlock) => ({
            user: context.user,
            ...requestedBlock.toObject(),
          }),
        );
      } else {
        modifiedRequestedBlocks = requestBlocks.map(
          async (requestedBlock) => {
            const objectifiedRequestedBlock = requestedBlock.toObject();
            const { userId: ownerId, ...restBlockFields } = objectifiedRequestedBlock;
            const user = await userHash(ownerId);
            return {
              user,
              ...restBlockFields,
            };
          },
        );
      }
      redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(modifiedRequestedBlocks));
      return modifiedRequestedBlocks;
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('requestedBlocks', e);
  }
}

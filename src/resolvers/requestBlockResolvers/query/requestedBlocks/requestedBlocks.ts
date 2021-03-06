import { GraphQLError } from 'graphql';

import RequestBlockModel from 'src/models/RequestBlockModel';
import userHash from 'src/utis/userHash/userHash';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import { QueryRequestedBlocksArgs } from 'src/generated/graphql';

export default async function requestedBlocks(
  { isUserOnly }: QueryRequestedBlocksArgs,
  { req: context, redisClient, customRedisGet }: Context,
) {
  try {
    if (context.user) {
      const redisKey = isUserOnly ? 'MY_REQUESTED_BLOCKS' : 'REQUESTED_BLOCKS';
      const cachedRequestedBlocks = await customRedisGet(REDIS_KEYS[redisKey]);
      if (cachedRequestedBlocks) {
        return cachedRequestedBlocks;
      }
      const searchCondition = isUserOnly ? { userId: { $in: [context.user?._id] } } : {};
      const requestBlocks = await RequestBlockModel
        .find(searchCondition)
        .sort([['createdAt', 'requestAt']]);
      const modifiedRequestedBlocks: any[] = [];
      if (isUserOnly) {
        requestBlocks.forEach(
          (requestedBlock) => {
            const objectifiedRequestedBlock = requestedBlock.toObject();
            objectifiedRequestedBlock.user = context.user;
            modifiedRequestedBlocks.push(objectifiedRequestedBlock);
          },
        );
      } else {
        for (const requestedBlock of requestBlocks) {
          const objectifiedRequestedBlock = requestedBlock.toObject();
          objectifiedRequestedBlock.user = await userHash(objectifiedRequestedBlock.userId);
          modifiedRequestedBlocks.push(objectifiedRequestedBlock);
        }
      }
      redisClient.set(REDIS_KEYS[redisKey], JSON.stringify(modifiedRequestedBlocks));
      return modifiedRequestedBlocks;
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('requestedBlocks', e);
  }
}

import { GraphQLError } from 'graphql';

import { TRequestDanglingBlock } from 'src/generated/graphql';
import { encryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import RequestBlockModel from 'src/models/RequestBlockModel';
import { Context } from 'src/context';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import { resetDanglingBlocksCache } from 'src/utis/redis/redis';

export default async function requestDanglingBlock(
  { requestBlockData }: { requestBlockData: TRequestDanglingBlock },
  { req: context, redisClient }: Context,
) {
  try {
    if (context.user) {
      const {
        message,
        cipherKeyForTheMessage,
        messageType,
      } = requestBlockData;

      const newRequestedBlock = new RequestBlockModel({
        message: encryptMessageForRequestedBlock(message, cipherKeyForTheMessage),
        userId: context.user._id,
        messageType,
      });
      await newRequestedBlock.save();
      resetDanglingBlocksCache(redisClient);
      return newRequestedBlock.toObject();
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('requestDanglingBlock', e);
  }
}

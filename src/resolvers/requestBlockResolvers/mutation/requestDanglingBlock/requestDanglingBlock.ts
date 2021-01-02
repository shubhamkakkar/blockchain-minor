import { GraphQLError } from 'graphql';

import { TRequestDanglingBlock } from 'src/generated/graphql';
import { encryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import RequestBlockModel from 'src/models/RequestBlockModel';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';

export default async function requestDanglingBlock(
  { requestBlockData }: { requestBlockData: TRequestDanglingBlock },
  { req: context, redisClient }: Context,
) {
  if (context.user) {
    const {
      message,
      cipherKeyForTheMessage,
    } = requestBlockData;
    const newRequestedBlock = new RequestBlockModel({
      message: encryptMessageForRequestedBlock(message, cipherKeyForTheMessage),
      userId: context.user._id,
    });
    await newRequestedBlock.save();
    redisClient.del(REDIS_KEYS.MY_REQUESTED_BLOCKS);
    redisClient.del(REDIS_KEYS.REQUESTED_BLOCKS);
    return newRequestedBlock.toObject();
  }
  throw new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

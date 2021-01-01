import { GraphQLError } from 'graphql';

import { TRequestDanglingBlock } from 'src/generated/graphql';
import { encryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import RequestBlockModel from 'src/models/RequestBlockModel';

export default async function requestDanglingBlock(
  { requestBlockData }: { requestBlockData: TRequestDanglingBlock },
  context: any,
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
    return newRequestedBlock.toObject();
  }
  throw new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

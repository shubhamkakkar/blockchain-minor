import { GraphQLError } from 'graphql';
import { TRequestDanglingBlock } from '../../../../generated/graphql';
import { encryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import RequestBlockModel from '../../../../models/RequestBlockModel';

export default async function requestDanglingBlock(
  { requestBlockData }: { requestBlockData: TRequestDanglingBlock },
  context: any,
) {
  const tokenContent = await verifyToken(context.authorization);
  if (!tokenContent.error) {
    const {
      message,
      cipherKeyForTheMessage,
    } = requestBlockData;
    const newRequestedBlock = new RequestBlockModel({
      message: encryptMessageForRequestedBlock(message, cipherKeyForTheMessage),
      userId: tokenContent.userId,
    });
    await newRequestedBlock.save();
    return newRequestedBlock.toObject();
  }
  throw new GraphQLError(tokenContent.error || 'Authentication token not present');
}

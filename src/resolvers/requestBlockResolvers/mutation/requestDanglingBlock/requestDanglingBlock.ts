import { GraphQLError } from 'graphql';
import { TRequestDanglingBlock } from '../../../../generated/graphql';
import { encryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import RequestBlockModel from '../../../../models/RequestBlockModel';

export default async function requestDanglingBlock(
  { requestBlockData }: { requestBlockData: TRequestDanglingBlock },
  context: any,
) {
  const tokenContent = verifyToken(context.authorization);
  if (tokenContent) {
    const {
      message,
      cipherKeyForTheMessage,
    } = requestBlockData;

    const { userId } = tokenContent;
    const newRequestedBlock = new RequestBlockModel({
      message: encryptMessageForRequestedBlock(message, cipherKeyForTheMessage),
      userId,
    });

    await newRequestedBlock.save();
    return newRequestedBlock.toObject();
  }
  throw new GraphQLError('Authentication token not present');
}

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
      privateKey,
    } = requestBlockData;

    const { userId } = tokenContent;
    let SECRET_KEY = '';
    if (cipherKeyForTheMessage) {
      SECRET_KEY = cipherKeyForTheMessage;
    } else if (privateKey) {
      SECRET_KEY = privateKey;
    } else {
      throw new GraphQLError('Either privateKey or cipherKey is required for requesting a dangling block');
    }

    // todo :  find a strong encryption decryption algo
    const newRequestedBlock = new RequestBlockModel({
      message: encryptMessageForRequestedBlock(message, SECRET_KEY),
      userId,
    });

    await newRequestedBlock.save();
    console.log({ newRequestedBlock: newRequestedBlock.toObject() });
    return {
      ...newRequestedBlock.toObject(),
    };
  }
  throw new GraphQLError('Authentication token not present');
}

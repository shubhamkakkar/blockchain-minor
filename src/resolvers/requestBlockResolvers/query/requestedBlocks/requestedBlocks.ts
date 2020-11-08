import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import RequestBlockModel from '../../../../models/RequestBlockModel';
import UserModel from '../../../../models/UserModel';

export default async function requestedBlocks(context: any, isUserOnly = false) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
      const { userId } = tokenContent;
      const searchCondition = isUserOnly ? { userId: { $in: [userId] } } : {};
      const requestBlocks = await RequestBlockModel.find(searchCondition);
      let modifiedRequestedBlocks = [];
      if (isUserOnly) {
        const user = await UserModel.findById(userId);
        modifiedRequestedBlocks = requestBlocks.map(
          (requestedBlock) => ({
            user: user?.toObject(),
            ...requestedBlock.toObject(),
          }),
        );
      } else {
        modifiedRequestedBlocks = requestBlocks.map(
          async (requestedBlock) => {
            const objectifiedRequestedBlock = requestedBlock.toObject();
            const { userId: ownerId, ...restBlockFields } = objectifiedRequestedBlock;
            const user = await UserModel.findById(ownerId);
            return {
              user: user?.toObject(),
              ...restBlockFields,
            };
          },
        );
      }
      return modifiedRequestedBlocks;
    }
  } catch (e) {
    console.log('requestedBlocks() e', e);
    throw new GraphQLError('requestedBlocks() e');
  }
  throw new GraphQLError('Authentication token not present');
}

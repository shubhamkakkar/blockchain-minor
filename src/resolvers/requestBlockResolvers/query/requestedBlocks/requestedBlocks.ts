import { GraphQLError } from 'graphql';

import { verifyToken } from 'utis/jwt/jwt';
import RequestBlockModel from 'models/RequestBlockModel';
import userHash from 'utis/userHash/userHash';

export default async function requestedBlocks(context: any, isUserOnly = false) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (!tokenContent.error) {
      const { userId } = tokenContent;
      const searchCondition = isUserOnly ? { userId: { $in: [userId] } } : {};
      const requestBlocks = await RequestBlockModel.find(searchCondition);
      let modifiedRequestedBlocks = [];
      if (isUserOnly) {
        modifiedRequestedBlocks = requestBlocks.map(
          (requestedBlock) => ({
            user: tokenContent.user,
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
      return modifiedRequestedBlocks;
    }
    return new GraphQLError(tokenContent.error || 'Invalid authentication token');
  } catch (e) {
    console.log('requestedBlocks() e', e);
    throw new GraphQLError('requestedBlocks() e');
  }
}

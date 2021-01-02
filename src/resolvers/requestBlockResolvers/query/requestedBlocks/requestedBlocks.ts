import { GraphQLError } from 'graphql';

import RequestBlockModel from 'src/models/RequestBlockModel';
import userHash from 'src/utis/userHash/userHash';
import { Context } from 'src/context';

export default async function requestedBlocks({ req: context }: Context, isUserOnly = false) {
  try {
    if (context.user) {
      const searchCondition = isUserOnly ? { userId: { $in: [context.user._id] } } : {};
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
      return modifiedRequestedBlocks;
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    console.log('requestedBlocks() e', e);
    throw new GraphQLError('requestedBlocks() e');
  }
}

import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import RequestBlockModel from '../../../../models/RequestBlockModel';

export default async function requestedBlocks(context: any, isUserOnly = false) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
      const { userId } = tokenContent;
      const searchCondition = isUserOnly ? { userId: { $in: [userId] } } : {};
      return await RequestBlockModel.find(searchCondition);
    }
  } catch (e) {
    console.log('requestedBlocks() e', e);
    throw new GraphQLError('requestedBlocks() e');
  }

  throw new GraphQLError('Authentication token not present');
}

import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import UserModel from '../../../../models/UserModel';

export default function user(context: any) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (!tokenContent) {
      return new GraphQLError('Authentication token not present');
    }
    return UserModel.findById(
      tokenContent.userId,
    ).lean();
  } catch (e) {
    console.log('user e()', e);
    throw new GraphQLError(`Internal server user e() : ${e}`);
  }
}

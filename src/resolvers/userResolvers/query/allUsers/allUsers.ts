import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import UserModel from '../../../../models/UserModel';
import { User } from '../../../../generated/graphql';

export default function allUsers(context: any) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (!tokenContent) {
      return new GraphQLError('Authentication token not present');
    }
    return UserModel.find(
      {
        _id: { $ne: tokenContent.userId },
      },
    ).lean() as unknown as User[];
  } catch (e) {
    console.log('allUsers e()', e);
    throw new GraphQLError(`Internal server allUsers e() : ${e}`);
  }
}

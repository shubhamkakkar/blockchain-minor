import { GraphQLError } from 'graphql';

import { verifyToken } from 'src/utis/jwt/jwt';
import UserModel from 'src/models/UserModel';

export default async function makeUserAdmin(userId: string, context: any) {
  try {
    const tokenContent = await verifyToken(`${context.authorization}`);
    if (tokenContent.error) {
      return new GraphQLError(tokenContent.error);
    }
    if (tokenContent.user?.role === 'admin') {
      await UserModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          role: 'admin',
        },
      );
      return true;
    }
    return new GraphQLError('You can not make a user admin');
  } catch (e) {
    console.log('makeUserAdmin e()', e);
    throw new GraphQLError(`Internal server makeUserAdmin e() : ${e}`);
  }
}

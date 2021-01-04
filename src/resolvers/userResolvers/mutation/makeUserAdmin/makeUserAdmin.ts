import { GraphQLError } from 'graphql';

import UserModel from 'src/models/UserModel';
import { ReturnedUser } from 'src/generated/graphql';
import { Context } from 'src/context';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function makeUserAdmin(
  userId: string, { req: context, redisClient }: Context,
) {
  try {
    if (!context.user) {
      return new GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    if (context.user?.role === 'admin') {
      const user = await UserModel.findById(userId).lean() as unknown as ReturnedUser;
      if (user) {
        if (user.role === 'admin') {
          return new GraphQLError('User is already admin');
        }
        await UserModel.findOneAndUpdate(
          {
            _id: userId,
          },
          {
            role: 'admin',
          },
        );
        redisClient.del(user._id);
        return true;
      }
      return new GraphQLError('User not found');
    }
    return new GraphQLError('You can not make a user admin');
  } catch (e) {
    return errorHandler('makeUserAdmin', e);
  }
}

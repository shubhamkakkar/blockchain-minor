import { GraphQLError } from 'graphql';

import UserModel from 'src/models/UserModel';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';

export default async function allUsers({ req: context, redisClient }: Context) {
  try {
    let conditions:any = {};
    if (context.user) {
      conditions = {
        _id: { $ne: context.user._id },
      };
    }
    return redisClient.get(REDIS_KEYS.ALL_USERS, async (err, cachedUsers) => {
      if (cachedUsers) {
        return JSON.parse(cachedUsers);
      }
      const users = await UserModel.find(conditions).select('-password');
      redisClient.set(REDIS_KEYS.ALL_USERS, JSON.stringify(users));
      return users;
    });
  } catch (e) {
    console.log('allUsers e()', e);
    throw new GraphQLError(`Internal server allUsers e() : ${e}`);
  }
}

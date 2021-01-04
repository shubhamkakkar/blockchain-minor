import UserModel from 'src/models/UserModel';
import { Context } from 'src/context';
import { REDIS_KEYS } from 'src/constants';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function allUsers({ req: context, redisClient, customRedisGet }: Context) {
  try {
    let conditions:any = {};
    if (context.user) {
      conditions = {
        _id: { $ne: context.user._id },
      };
    }
    const cachedUsers = await customRedisGet(REDIS_KEYS.ALL_USERS);
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await UserModel.find(conditions).select('-password');
    redisClient.set(REDIS_KEYS.ALL_USERS, JSON.stringify(users));
    return users;
  } catch (e) {
    return errorHandler('allUsers', e);
  }
}

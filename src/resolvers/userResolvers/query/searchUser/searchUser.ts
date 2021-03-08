import { GraphQLError } from 'graphql';

import { REDIS_KEYS } from 'src/constants';
import { Context } from 'src/context';
import { QuerySearchUserArgs } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function searchUser(
  { filter }: QuerySearchUserArgs, { req: context, customRedisSetEx, customRedisGet }: Context,
) {
  try {
    if (!context.user) {
      return new GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    const redisKey = `${REDIS_KEYS.SEARCH_USER}-${filter}`;
    const cachedSearchUser = await customRedisGet(redisKey);
    if (cachedSearchUser) {
      return cachedSearchUser;
    }
    const indexSearchResult = await UserModel.find(
      { $text: { $search: filter } },
    );

    if (indexSearchResult.length) {
      customRedisSetEx(redisKey, indexSearchResult);
      return indexSearchResult;
    }
    const regexUserSearch = await UserModel.find(
      {
        $or: [
          { firstName: { $regex: `^${filter}`, $options: 'i' } },
          { lastName: { $regex: `^${filter}`, $options: 'i' } },
          { middleName: { $regex: `^${filter}`, $options: 'i' } },
          { email: { $regex: `^${filter}`, $options: 'i' } },
        ],
      },
    );
    customRedisSetEx(redisKey, regexUserSearch);
    return regexUserSearch;
  } catch (e) {
    return errorHandler('searchUser', e);
  }
}

/**
 TODO
 * make a 10 minute redis cache for this searhc for every "args.filter" and search in redis first;
 * make a 1 day redis cache for a block for public key cryptosystem
 */

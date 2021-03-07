import { GraphQLError } from 'graphql';

import { Context } from 'src/context';
import { QuerySearchUserArgs } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default function searchUser(args: QuerySearchUserArgs, { req: context }: Context) {
  try {
    if (!context.user) {
      return new GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    return UserModel.find({ $text: { $search: args.filter } });
  } catch (e) {
    return errorHandler('searchUser', e);
  }
}

/** TODO
 * delete entire redis and mongodb;
 * make a 10 minute redis cache for this searhc for every "args.filter" and search in redis first;
 * make a 1 day redis cache for a block for public key cryptosystem
 */

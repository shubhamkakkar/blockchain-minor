import {
  loginUser, allUsers, user, searchUser,
} from './query';
import { signUpUser, makeUserAdmin } from './mutation';

import { TLoginArgs, TSignupArgs, QuerySearchUserArgs } from 'src/generated/graphql';
import { Context } from 'src/context';

export default {
  Query: {
    login: (parent: any, args: TLoginArgs) => loginUser(args),
    allUsers: (parent: any, args: any, context: Context) => allUsers(context),
    user: (parent: any, args: any, context: Context) => user(context),
    searchUser: (
      parent: any, args: QuerySearchUserArgs, context: Context,
    ) => searchUser(args, context),
  },
  Mutation: {
    signUp: (parent: any, args: TSignupArgs, context: Context) => signUpUser(args, context),
    makeUserAdmin: (parent: any, args: string, context: Context) => makeUserAdmin(args, context),
  },
};

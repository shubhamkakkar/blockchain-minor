import { loginUser, allUsers, user } from './query';
import { signUpUser, makeUserAdmin } from './mutation';

import { TLoginArgs, TSignupArgs } from 'src/generated/graphql';
import { Context } from 'src/context';

export default {
  Query: {
    login: (parent: any, args: TLoginArgs) => loginUser(args),
    allUsers: (parent: any, args: any, context: Context) => allUsers(context),
    user: (parent: any, args: any, context: Context) => user(context),
  },
  Mutation: {
    singUp: (parent: any, args: TSignupArgs) => signUpUser(args),
    makeUserAdmin: (parent: any, args: string, context: Context) => makeUserAdmin(args, context),
  },
};

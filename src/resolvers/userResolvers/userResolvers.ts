import { loginUser, allUsers } from './query';
import { signUpUser } from './mutation';
import { TLoginArgs, TSignupArgs } from '../../generated/graphql';

export default {
  Query: {
    login: (parent: any, args: TLoginArgs) => loginUser(args),
    allUsers: (parent: any, args: any, context: any) => allUsers(context),
  },
  Mutation: {
    singUp: (parent: any, args: TSignupArgs) => signUpUser(args),
  },
};

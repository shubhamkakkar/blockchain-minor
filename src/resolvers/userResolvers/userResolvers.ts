import { loginUser } from './query';
import { signUpUser } from './mutation';
import { TLoginArgs, TSignupArgs } from '../../generated/graphql';

export default {
  Query: {
    login: (parent: any, args: TLoginArgs) => loginUser(args),
  },
  Mutation: {
    singUp: (parent: any, args: TSignupArgs) => signUpUser(args),
  },
};

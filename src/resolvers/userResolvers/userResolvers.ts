import { userQuery } from './query';
import signUpUser from './mutation/signUpUser'
import { TSignupArgs } from '../../generated/graphql';
import loginUser from './mutation/loginUser';

export default {
    Query: {
        users: userQuery,
    },
    Mutation: {
        singup: (parent: any, args: TSignupArgs) => signUpUser(args),
        login: (parent: any, args: any) => loginUser(args)
    }
};

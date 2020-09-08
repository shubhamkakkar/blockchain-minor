import { userQuery } from './query';
import signUpUser from './mutation/signUpUser'
import { TSignupArgs } from 'generated/graphql';

export default {
    Query: {
        users: userQuery,
    },
    Mutation: {
        singup: (parent: any, args: TSignupArgs) => signUpUser(args) 
    }
};

import { userQuery } from './query';
import signUpUser from './mutation/signUpUser'


export default {
    Query: {
        users: userQuery,
    },
    Mutation: {
        singup: (parent: any, args: any) => signUpUser(args) 
    }
};
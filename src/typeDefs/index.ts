import { gql } from 'apollo-server';
import userSchema from './user/user';
import requestBlock from './requestBlock/requestBlock';

const linkSchema = gql`
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
    type Subscription {
        _: Boolean
    }
`;

export default [linkSchema, userSchema, requestBlock];

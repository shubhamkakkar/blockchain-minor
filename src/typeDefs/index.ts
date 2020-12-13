import { gql } from 'apollo-server';
import userSchema from './user/user';
import requestBlock from './requestBlock/requestBlock';
import blockchain from './blockchain/blockchain';

const linkSchema = gql`
    scalar Date
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

export default [linkSchema, userSchema, requestBlock, blockchain];

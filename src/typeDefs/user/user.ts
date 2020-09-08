import { gql } from 'apollo-server';

export default gql`
    extend type Query {
        users: [ReturnedUser!],
    }
      
    type ReturnedUser {
        _id: ID!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String!
        publicKey: String!
        token: String!
    }
`
import { gql } from 'apollo-server';

export default gql`
    extend type Query {
        users: [ReturnedUser!],
    }

    extend type Mutation {
        singup( userArgs: TSignupArgs ): ReturnedUser!
    }
    
    input TSignupArgs {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        middleName: String
    }
          
    type ReturnedUser {
        _id: ID!
        publicKey: String!
        token: String!
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        middleName: String
    }
`


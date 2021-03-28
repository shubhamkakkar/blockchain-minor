import { gql } from 'apollo-server';

export default gql`
    type TSignupArgs {
        firstName: String!
        lastName: String!
        middleName: String
        email: String!
        password: String!
    }

    type TLoginArgs {
        email: String!
        password: String!
    }

    type ReturnedUser {
        _id: ID!
        publicKey: String!
        token: String!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String
        role: String!
        privateKey: String!
    }
    
    type User {
        _id: ID!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String
        publicKey: String!
        role: String!
    }

    extend type Query {
        login (
            email: String!
            password: String!
        ):  ReturnedUser!  
        
        allUsers : [User]!
        user: User!
        searchUser(filter: String!): [User]!
    }

    extend type Mutation {
        signUp(
            email: String!
            password: String!
            firstName: String!,
            lastName: String!,
            middleName: String
        ): ReturnedUser!
        
        makeUserAdmin (id: String!): Boolean!
    }
`;

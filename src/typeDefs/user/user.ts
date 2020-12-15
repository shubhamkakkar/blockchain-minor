import { gql } from 'apollo-server';

export default gql`
    type TSignupArgs {
        firstName: String!
        lastName: String!
        middleName: String
        email: String!
        password: String!
        inviteCode: String!
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
    }
    
    type User {
        _id: ID!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String
    }


    type ReturnedUserSignup {
        _id: ID!
        publicKey: String!
        token: String!
        email: String!
        firstName: String!
        lastName: String!
        middleName: String
        privateKey: String!
    }
    
    type InviteCode {
        code: String!
    }
    
    extend type Query {    
        login (
            email: String!
            password: String!
        ):  ReturnedUser!  
        
        allUsers: [User]!
        user: User!
    }

    extend type Mutation {
        singUp(
            email: String!
            password: String!
            firstName: String!,
            lastName: String!,
            middleName: String
        ): ReturnedUserSignup!
        
        generateInviteCode: InviteCode!

    }
`;

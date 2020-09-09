import { gql } from 'apollo-server';

const SharePropsSignup = `
_id: ID!
publicKey: String!
token: String!
email: String!
firstName: String!
lastName: String!
middleName: String
`


export default gql`
    extend type Query {
        users: [ReturnedUser!],
    }

    extend type Mutation {
        singup(
            email: String!,
            password: String!,
            firstName: String!,
            lastName: String!,
            middleName: String
            ): ReturnedUserSignup!
    }
    
    input TSignupArgs {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        middleName: String
    }
          
    type ReturnedUser {
      ${SharePropsSignup}
    }

    type ReturnedUserSignup {
        privateKey: String! 
       ${SharePropsSignup}
    }

`


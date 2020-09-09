import { gql } from 'apollo-server';

const sharePropsSignup = `
    _id: ID!
    publicKey: String!
    token: String!
    email: String!
    firstName: String!
    lastName: String!
    middleName: String
`

const shareLoginAnfSignupProps = `
    email: String!
    password: String!
`


export default gql`
    extend type Query {
        users: [ReturnedUser!],
    }

    extend type Mutation {
        singup(
            ${shareLoginAnfSignupProps}
            firstName: String!,
            lastName: String!,
            middleName: String
            ): ReturnedUserSignup!
        
        login(
            ${shareLoginAnfSignupProps}
        ):  ReturnedUser!  
    }
    
    type TSignupArgs {
        ${shareLoginAnfSignupProps}
        firstName: String!
        lastName: String!
        middleName: String
    }

    type TLoginArgs {
        ${shareLoginAnfSignupProps}
    }

    type ReturnedUser {
      ${sharePropsSignup}
    }

    type ReturnedUserSignup {
        privateKey: String! 
       ${sharePropsSignup}
    }

`


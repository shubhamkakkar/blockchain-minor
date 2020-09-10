import { gql } from 'apollo-server';

// todo: add file/image upload

export default gql`
    scalar Date
    type TRequestedDanglingBlock {
        _id : ID!
        userId: ID!
        requestAt: Date!
        message: String!
    }
    
    input TRequestDanglingBlock {
        privateKey: String
        cipherKeyForTheMessage: String
        message: String!
    }
    
    extend type Query {
        requestedBlocks: [TRequestedDanglingBlock]!
        myRequestedBlocks: [TRequestedDanglingBlock]!
    }
    
    extend type Mutation {
        requestDanglingBlock(
            requestBlockData: TRequestDanglingBlock!
        ): TRequestedDanglingBlock!    
    }
`;

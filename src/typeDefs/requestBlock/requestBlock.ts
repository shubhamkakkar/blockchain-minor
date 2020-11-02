import { gql } from 'apollo-server';

// todo: add file/image upload

export default gql`
    scalar Date
    type TRequestedDanglingBlock {
        _id : ID!
        userId: ID!
        requestAt: Date!
        message: String!
        acceptCount: Int!
        rejectCount: Int!
    }
    
    type TAcceptDeclineCount {
        acceptCount: Int
        rejectCount: Int
    }
    
    input TRequestDanglingBlock {
        privateKey: String
        cipherKeyForTheMessage: String
        message: String!
    }
    
    input TAcceptDenyParams {
        blockId: ID!
        isAccept: Boolean
    }
    
    extend type Query {
        requestedBlocks: [TRequestedDanglingBlock]!
        myRequestedBlocks: [TRequestedDanglingBlock]!
    }
    
    extend type Mutation {
        requestDanglingBlock(
            requestBlockData: TRequestDanglingBlock!
        ): TRequestedDanglingBlock!
        acceptDeclineBlock(
            acceptDenyParams: TAcceptDenyParams!
        ): TAcceptDeclineCount
    }
`;

import { gql } from 'apollo-server';

export default gql`
    enum RequestedBlockMessage {
        PERSONAL_MEDICAL_INFORMATION
        INSURANCE_INFORMATION
        MEDICAL_REPORTS
    }
    type TRequestedDanglingBlock {
        _id : ID!
        user: User!
        requestAt: Date!
        message: String!
        acceptCount: Int!
        rejectCount: Int!
        messageType: RequestedBlockMessage!
    }
    
    type TAcceptDeclineCount {
        acceptCount: Int!
        rejectCount: Int!
    }

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }
    
    input TRequestDanglingBlock {
        cipherKeyForTheMessage: String!
        message: String!
        messageType: RequestedBlockMessage!
        file: Upload!
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

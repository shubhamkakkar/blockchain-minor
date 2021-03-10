"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
exports.default = apollo_server_1.gql `
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

    input TRequestDanglingBlock {
        cipherKeyForTheMessage: String!
        message: String!
        messageType: RequestedBlockMessage!
    }
    
    input TAcceptDenyParams {
        blockId: ID!
        isAccept: Boolean
    }
    
    extend type Query {
        requestedBlocks(isUserOnly: Boolean): [TRequestedDanglingBlock]!
        isAlreadyVoted(blockId: ID!): Boolean!
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
exports.default = apollo_server_1.gql `
    type ReceivedBlock {
       sharedAt: Date!
       sharedBy: User!
       _id: ID!
    }
    
    type DecryptedReceivedBlock {
       message: String!
       sharedAt: Date!
    }   
     

    type SharedBlock {
        encryptedMessage: String!
        recipientUser: User!
        sharedAt: Date!
    }

    type TPublicLedger {
        _id: ID!
        data: String!
        ownerId: ID!
        shared: [SharedBlock!]!
        createdAt: Date!
        hash: String!
        ownerProfile: User
        messageType: RequestedBlockMessage
    }
    
    type MyBlock {
        data: String!
        prevHash: String!
    }
    
    type TSharedBlockResponse {
        isSuccess: Boolean!
        errorMessage: String
    }
    
    input TShareBlockArgs {
        blockId: ID!
        recipientUserId: ID!
        cipherTextOfBlock: String!
        privateKey: String!
    }
    
    input ReceivedBlockArgs {
        blockId: ID!
        privateKey: String!
    }
    
    input MyBlockArgs {
        blockId: ID!
        cipherTextOfBlock: String!
    }

    extend type Query {
        publicLedger: [TPublicLedger]!
        sharedBlocks: [SharedBlock!]! 
        receivedBlocks: [ReceivedBlock!]!
        receivedBlock (
             receivedBlockArgs: ReceivedBlockArgs!
        ): DecryptedReceivedBlock!
        myBlocks: [TPublicLedger!]!
        myBlock (myBlockArgs: MyBlockArgs): MyBlock!
    }
    
    extend type Mutation {
        shareBlock(shareBlockArgs: TShareBlockArgs!): TSharedBlockResponse! 
    }
`;

import { gql } from 'apollo-server';

export default gql`
    type ReceivedBlock {
       sharedAt: Date!
       sharedBy: User!
       _id: ID!
    }
    
    type DecryptedReceivedBlock {
       message: String!
       sharedAt: Date!
       messageType: RequestedBlockMessage!
    }   
     

    type SharedBlock {
        recipientUser: User!
        sharedAt: Date!
        _id: ID!
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

    type MyBlockShared {
        sharedAt: Date!
        _id: ID!
    }
    
    type MyBlock {
        _id: ID!
        data: String!
        createdAt: Date!
        hash: String!
        prevHash: String!
        ownerProfile: User
        messageType: RequestedBlockMessage
        shared: [MyBlockShared]!
    }
    
    type TSharedBlockResponse {
        isSuccess: Boolean!
        errorMessage: String
    }

    input RecipientUser {
        userId: ID!
    }
    
    input TShareBlockArgs {
        blockId: ID!
        recipientUserId: ID!
        cipherTextOfBlock: String!
    }
    
    input ReceivedBlockArgs {
        blockId: ID!
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
        ): MyBlock!
        myBlocks: [TPublicLedger!]!
        myBlock (myBlockArgs: MyBlockArgs): MyBlock!
    }
    
    extend type Mutation {
        shareBlock(shareBlockArgs: TShareBlockArgs!): TSharedBlockResponse! 
    }
`;

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
        createdAt: Date
    }
    
    type MyBlock {
        data: String!
        shared: [SharedBlock!]!
        createdAt: Date
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

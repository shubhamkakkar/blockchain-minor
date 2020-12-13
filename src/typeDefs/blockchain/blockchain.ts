import { gql } from 'apollo-server';

export default gql`
    type Shared {
       sharedAt: Date!
    }
    
    type ReceivedBlock {
       shared: [Shared]!
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

    extend type Query {
        publicLedger: [TPublicLedger]!
        sharedBlocks: [SharedBlock!]! 
        receivedBlocks: [ReceivedBlock!]!
        receivedBlock (
             receivedBlockArgs: ReceivedBlockArgs!
        ): DecryptedReceivedBlock!
    }
    
    extend type Mutation {
        shareBlock(shareBlockArgs: TShareBlockArgs!): TSharedBlockResponse! 
    }
`;

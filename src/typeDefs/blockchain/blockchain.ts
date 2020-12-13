import { gql } from 'apollo-server';

/**
 * no need to define Date as scalar here as it is done in the other resolver,
 * as these all combines in one file so it will be taken care automatically
 */

// extracted from TPublicLedger
// prevHash: String!
// hash: String!
// timeStamp: Date!
// nounce: Int!

export default gql`
    type SharedBlock {
        encryptedMessage: String!
        recipientUserId: ID!
        sharedAt: Date!
    }

    type TPublicLedger {
        _id: ID!
        data: String!
        ownerId: ID!
        shared: [SharedBlock]!
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

    extend type Query {
        publicLedger: [TPublicLedger]!
        sharedBlocks: [SharedBlock]! 
    }
    
    extend type Mutation {
        shareBlock(shareBlockArgs: TShareBlockArgs!): TSharedBlockResponse! 
    }
`;

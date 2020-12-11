import { gql } from 'apollo-server';

/**
 * no need to define Date as scalar here as it is done in the other resolver,
 * as these all combines in one file so it will be taken care automatically
 */

export default gql`
    type TPublicLedger {
        _id: ID!
        data: String!
        prevHash: String!
        hash: String!
        timeStamp: Date!
        nounce: Int!
        ownerId: ID!
    }
    
    type TSharedBlockResponse {
        isSuccess: Boolean!
    }
    
    input TShareBlockArgs {
        blockId: ID!
        recipientUserId: ID!
        cipherTextOfBlock: String!
        privateKey: String!
    }

    extend type Query {
        publicLedger: [TPublicLedger]!
    }
    
    extend type Mutation {
        shareBlock(shareBlockArgs: TShareBlockArgs!): TSharedBlockResponse! 
    }
`;

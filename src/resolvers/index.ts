import { GraphQLDateTime } from 'graphql-iso-date';
import userResolvers from './userResolvers';
import requestBlockResolvers from './requestBlockResolvers';
import blockchainResolver from './blockchainResolver';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [customScalarResolver, userResolvers, requestBlockResolvers, blockchainResolver];

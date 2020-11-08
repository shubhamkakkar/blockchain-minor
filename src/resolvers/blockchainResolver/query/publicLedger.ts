import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../utis/jwt/jwt';
import BlockModel from '../../../models/BlockModel';

export default async function publicLedger(context: any) {
  const tokenContent = verifyToken(context.authorization);
  if (tokenContent) {
    return BlockModel.find();
  }
  throw new GraphQLError('Authentication token not present');
}

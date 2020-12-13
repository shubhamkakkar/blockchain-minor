import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';

export default async function publicLedger(context: any) {
  const tokenContent = await verifyToken(context.authorization);
  if (!tokenContent.error) {
    return BlockModel.find({}, { data: 1, ownerId: 1, shared: 1 });
  }
  throw new GraphQLError(tokenContent.error || 'Authentication token not present');
}

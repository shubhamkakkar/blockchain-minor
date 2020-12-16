import { GraphQLError } from 'graphql';
import { FilterQuery } from 'mongoose';

import { verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';

export default async function publicLedger(context: any, myBlocksOnly = false) {
  const tokenContent = await verifyToken(context.authorization);
  if (!tokenContent.error) {
    const condition:FilterQuery<any> = {};
    if (myBlocksOnly) {
      condition.ownerId = tokenContent.userId;
    }
    return BlockModel.find(condition, { data: 1, ownerId: 1, shared: 1 });
  }
  throw new GraphQLError(tokenContent.error || 'Authentication token not present');
}

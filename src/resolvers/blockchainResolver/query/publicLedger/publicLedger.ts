import { GraphQLError } from 'graphql';
import { FilterQuery } from 'mongoose';

import BlockModel from 'src/models/BlockModel';

export default async function publicLedger(context: any, myBlocksOnly = false) {
  if (context.user) {
    const condition:FilterQuery<any> = {};
    if (myBlocksOnly) {
      condition.ownerId = context.user._id;
    }
    return BlockModel
      .find(condition, {
        data: 1, ownerId: 1, shared: 1, createdAt: 1,
      })
      .populate({
        path: 'shared',
        populate: 'recipientUser',
      });
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

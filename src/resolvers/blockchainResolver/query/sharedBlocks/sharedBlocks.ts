import { GraphQLError } from 'graphql';

import { verifyToken } from 'src/utis/jwt/jwt';
import BlockModel from 'src/models/BlockModel';
import { SharedBlock } from 'src/generated/graphql';

export default async function sharedBlocks(context: any) {
  const tokenContent = await verifyToken(context.authorization);
  if (!tokenContent.error) {
    const blocks = await BlockModel.find(
      { 'shared.0': { $exists: true }, ownerId: tokenContent.userId },
      { shared: 1, _id: 0 },
    ).lean() as { shared: SharedBlock[] }[];
    const allSharedBlocks:SharedBlock[] = [];
    blocks.forEach((block) => {
      allSharedBlocks.push(...block.shared);
    });

    return allSharedBlocks;
  }
  throw new GraphQLError(tokenContent.error || 'Authentication token not present');
}

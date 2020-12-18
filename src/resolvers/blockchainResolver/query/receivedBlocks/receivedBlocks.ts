import { GraphQLError } from 'graphql';

import userHash from 'utis/userHash/userHash';
import BlockModel from 'models/BlockModel';
import { verifyToken } from 'utis/jwt/jwt';
import { ReceivedBlock } from 'generated/graphql';

interface IReceivedBlock extends ReceivedBlock {
  ownerId: string
}

export default async function receivedBlocks(context: any) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (!tokenContent.error) {
      const blocks = await BlockModel.find(
        {
          'shared.recipientUser.email': tokenContent.user?.email,
        },
        { 'shared.sharedAt': 1, ownerId: 1 },
      ).lean() as unknown as IReceivedBlock;
      if (blocks) {
        // @ts-ignore
        for (const block of blocks) {
          block.sharedBy = await userHash(block.ownerId);
        }
        return blocks;
      }
      return new GraphQLError('Either the block does not exists, or it is not shared with you');
    }
    return new GraphQLError(tokenContent.error || 'Authentication token not present');
  } catch (e) {
    console.log('Internal server error receivedBlocks e()', e);
    throw new GraphQLError('Internal server error receivedBlocks e()', e);
  }
}

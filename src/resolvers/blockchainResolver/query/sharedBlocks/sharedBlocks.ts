import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import UserModel from '../../../../models/UserModel';
import { SharedBlock } from '../../../../generated/graphql';

export default async function sharedBlocks(context: any) {
  const tokenContent = verifyToken(context.authorization);
  if (tokenContent) {
    const blocks = await BlockModel.find({
      'shared.0': { $exists: true },
      ownerId: tokenContent.userId,
    }, { shared: 1, _id: 0 }).lean() as { shared: SharedBlock[] }[];
    const allSharedBlocks:SharedBlock[] = [];
    blocks.forEach((block) => {
      allSharedBlocks.push(...block.shared);
    });

    return allSharedBlocks;
  }
  throw new GraphQLError('Authentication token not present');
}

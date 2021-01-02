import { GraphQLError } from 'graphql';

import BlockModel from 'src/models/BlockModel';
import { SharedBlock } from 'src/generated/graphql';
import { Context } from 'src/context';

export default async function sharedBlocks({ req: context }: Context) {
  if (context.user) {
    const blocks = await BlockModel.find(
      { 'shared.0': { $exists: true }, ownerId: context.user._id },
      { shared: 1, _id: 0 },
    ).lean() as { shared: SharedBlock[] }[];
    const allSharedBlocks:SharedBlock[] = [];
    blocks.forEach((block) => {
      allSharedBlocks.push(...block.shared);
    });

    return allSharedBlocks;
  }
  return new GraphQLError('AUTHENTICATION NOT PROVIDED');
}

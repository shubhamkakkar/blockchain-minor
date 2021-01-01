import { GraphQLError } from 'graphql';

import { MyBlock, MyBlockArgs } from 'src/generated/graphql';
import { decryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import BlockModel from 'src/models/BlockModel';

export default async function myBlock(args: MyBlockArgs, context: any) {
  try {
    if (!context.user) {
      return new GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    const block = await BlockModel.findById(args.blockId).lean() as unknown as MyBlock;
    if (block) {
      const message = decryptMessageForRequestedBlock(
        `${block.data}`, args.cipherTextOfBlock,
      ) as string;
      if (message) {
        block.data = message;
        return block;
      }
      return new GraphQLError('cipherTextOfBlock is incorrect');
    }
    return new GraphQLError('Block not found');
  } catch (e) {
    console.log('Internal Server Error myBlock e ()', e);
    return new GraphQLError('Internal Server Error myBlock e ()');
  }
}

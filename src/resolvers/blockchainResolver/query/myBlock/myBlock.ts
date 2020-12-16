import { GraphQLError } from 'graphql';

import { MyBlock, MyBlockArgs } from '../../../../generated/graphql';
import { decryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';

export default async function myBlock(args: MyBlockArgs, context: any) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (tokenContent.error) {
      return new GraphQLError(tokenContent.error);
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
    return new GraphQLError('No Block found');
  } catch (e) {
    console.log('Internal Server Error myBlock e ()', e);
    return new GraphQLError('Internal Server Error myBlock e ()');
  }
}

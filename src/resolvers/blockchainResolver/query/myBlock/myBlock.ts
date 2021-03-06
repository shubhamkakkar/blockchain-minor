import { GraphQLError } from 'graphql';

import { TPublicLedger, MyBlockArgs } from 'src/generated/graphql';
import { decryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import BlockModel from 'src/models/BlockModel';
import { Context } from 'src/context';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function myBlock(
  args: MyBlockArgs,
  { req: context }: Context,
) {
  try {
    if (!context.user) {
      return new GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    const block = await BlockModel.findById(args.blockId).lean() as unknown as TPublicLedger;
    if (block) {
      if (block.ownerId.toString() === context.user._id.toString()) {
        const message = decryptMessageForRequestedBlock(
          `${block.data}`, args.cipherTextOfBlock,
        ) as string;
        if (message) {
          block.data = message;
          return block;
        }
        return new GraphQLError('cipherTextOfBlock is incorrect');
      }
      return new GraphQLError('You are not the owner of the block');
    }
    return new GraphQLError('Block not found');
  } catch (e) {
    return errorHandler('myBlock', e);
  }
}

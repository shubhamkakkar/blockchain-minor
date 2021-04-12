import { GraphQLError } from 'graphql';

import { ReceivedBlockArgs, SharedBlock } from 'src/generated/graphql';
import { verification } from 'src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem';
import BlockModel from 'src/models/BlockModel';
import userHash from 'src/utis/userHash/userHash';
import { Context } from 'src/context';

interface SharedBlockWithEncryptedMessage extends SharedBlock {
  encryptedMessage: string;
}

export default async function receivedBlock(
  receivedBlockArgs: ReceivedBlockArgs,
  { req: context }: Context,
) {
  try {
    if (context.user) {
      const block = await BlockModel.findOne(
        {
          _id: receivedBlockArgs.blockId,
          'shared.recipientUser': context.user._id,
          ownerId: { $ne: context.user?._id },
        },
        {
          'shared.sharedAt': 1, 'shared.encryptedMessage': 1, ownerId: 1, _id: 0,
        },
      ).lean() as { shared: SharedBlockWithEncryptedMessage[], ownerId: string };
      if (block) {
        const { encryptedMessage, sharedAt } = block.shared[0];
        const {
          publicKey: issuerPublicKey, privateKey: receiverPrivateKey,
        } = await userHash(block.ownerId);
        try {
          const message = verification({
            issuerPublicKey,
            receiverPrivateKey,
            encryptedMessage,
          });
          if (message) {
            return {
              message,
              sharedAt,
            };
          }
          return new GraphQLError('Validation failed');
        } catch (error) {
        return new GraphQLError(error);
        }
      }
      return new GraphQLError('Either the block does not exists, or it is not shared with you');
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    console.log('Internal server error receivedBlock e()', e);
    throw new GraphQLError('Internal server error receivedBlock e()', e);
  }
}

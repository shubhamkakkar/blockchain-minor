import { GraphQLError } from 'graphql';

import { ReceivedBlockArgs, SharedBlock } from 'src/generated/graphql';
import { verification } from 'src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem';
import BlockModel from 'src/models/BlockModel';
import userHash from 'src/utis/userHash/userHash';

export default async function receivedBlock(receivedBlockArgs: ReceivedBlockArgs, context: any) {
  try {
    if (context.user) {
      const block = await BlockModel.findOne(
        {
          _id: receivedBlockArgs.blockId,
          'shared.recipientUser.email': context.user.email,
        },
        {
          'shared.sharedAt': 1, 'shared.encryptedMessage': 1, ownerId: 1, _id: 0,
        },
      ).lean() as { shared: SharedBlock[], ownerId: string };
      if (block) {
        const { encryptedMessage, sharedAt } = block.shared[0];
        const { publicKey: issuerPublicKey } = await userHash(block.ownerId);
        try {
          const message = verification({
            issuerPublicKey,
            receiverPrivateKey: receivedBlockArgs.privateKey,
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

import { GraphQLError } from 'graphql';

import { ReceivedBlockArgs, SharedBlock } from 'src/generated/graphql';
import { verifyToken } from 'src/utis/jwt/jwt';
import { verification } from 'src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem';
import BlockModel from 'src/models/BlockModel';
import userHash from 'src/utis/userHash/userHash';

export default async function receivedBlock(receivedBlockArgs: ReceivedBlockArgs, context: any) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (!tokenContent.error) {
      const blocks = await BlockModel.findOne(
        {
          _id: receivedBlockArgs.blockId,
          'shared.recipientUser.email': tokenContent.user?.email,
        },
        {
          shared: 1, _id: 0, 'shared.$': 1, ownerId: 1,
        },
      ).lean() as { shared: SharedBlock[], ownerId: string };
      if (blocks) {
        const { encryptedMessage, sharedAt } = blocks.shared[0];
        const { publicKey: issuerPublicKey } = await userHash(blocks.ownerId);
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
    return new GraphQLError(tokenContent.error || 'Authentication token not present');
  } catch (e) {
    console.log('Internal server error receivedBlock e()', e);
    throw new GraphQLError('Internal server error receivedBlock e()', e);
  }
}

import { GraphQLError } from 'graphql';

import { decryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import BlockModel from 'src/models/BlockModel';
import { stringEncryption } from 'src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem';
import { TPublicLedger, TShareBlockArgs } from 'src/generated/graphql';
import { Context } from 'src/context';
import { resetPublicLedgerCache } from 'src/utis/redis/redis';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import UserModel from 'src/models/UserModel';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  { req: context, redisClient }: Context,
) {
  try {
    if (context.user) {
      if (shareBlockArgs.recipientUserId === context.user._id) {
        return {
          shareStatus: false,
          message: 'You can\'t share the block to your self.',
        };
      }
      const user = await UserModel.findById(shareBlockArgs.recipientUserId).select('_id, publicKey');
      if (user) {
        const blockDB = await BlockModel
          .findOne({
            _id: shareBlockArgs.blockId,
            ownerId: context.user._id,
          });

        if (blockDB) {
          const block = blockDB.toObject() as TPublicLedger;
          if (block.shared.find((
            { recipientUser },
          ) => recipientUser._id.toString() === shareBlockArgs.recipientUserId.toString())
          ) {
            return {
              isSuccess: false,
              errorMessage: 'Already shared with the user',
            };
          }

          try {
            const message = decryptMessageForRequestedBlock(
              `${block.data}`, shareBlockArgs.cipherTextOfBlock,
            ) as string;
            if (message) {
              const encryptedMessage = stringEncryption(
                {
                  message,
                  issuerPrivateKey: context.user.privateKey,
                  receiverPublicKey: user.toObject().publicKey,
                },
              );
              await blockDB.update({
                $push: {
                  shared: {
                    encryptedMessage,
                    recipientUser: shareBlockArgs.recipientUserId,
                  },
                },
              });
              resetPublicLedgerCache(redisClient);
              return {
                isSuccess: true,
              };
            }
            return {
              isSuccess: false,
              errorMessage: 'Failed to authenticate the block',
            };
          } catch (e) {
            console.log({ e });
            return {
              isSuccess: false,
              errorMessage: e,
            };
          }
        }
      } else {
        return new GraphQLError(
          'No block found Or you are not the owner of the block, and hence can not share the block',
        );
      }
      return new GraphQLError('No user found');
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('shareBlock', e);
  }
}

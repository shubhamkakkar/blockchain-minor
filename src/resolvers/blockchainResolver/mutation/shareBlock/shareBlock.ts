import { GraphQLError } from 'graphql';

import { decryptMessageForRequestedBlock } from 'src/utis/jwt/jwt';
import BlockModel from 'src/models/BlockModel';
import ValidationContract from 'src/utis/validator/validator';
import { stringEncryption } from 'src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem';
import userHash from 'src/utis/userHash/userHash';
import { TPublicLedger, TShareBlockArgs } from 'src/generated/graphql';
import { Context } from 'src/context';
import { resetPublicLedgerCache } from 'src/utis/redis/redis';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  { req: context, redisClient }: Context,
) {
  try {
    if (context.user) {
      const contract = new ValidationContract();
      contract.isRequired(shareBlockArgs.recipientUserId, 'recipientUserId is required');
      contract.isRequired(shareBlockArgs.privateKey, 'sender\'s privateKey is required');
      if (contract.isValid()) {
        if (shareBlockArgs.recipientUserId === context.user._id) {
          return {
            shareStatus: false,
            message: 'You can\'t share the block to your self.',
          };
        }
        const blockDB = await BlockModel
          .findOne({
            _id: shareBlockArgs.blockId,
            ownerId: context.user._id,
          });

        if (blockDB) {
          const block = blockDB.toObject() as TPublicLedger;
          if (block
            .shared
            .find((
              { recipientUser },
            ) => recipientUser._id.toString() === shareBlockArgs.recipientUserId.toString())
          ) {
            return {
              isSuccess: false,
              errorMessage: 'Already shared with the user',
            };
          }
          const recipientUser = await userHash(shareBlockArgs.recipientUserId);
          if (recipientUser) {
            try {
              const message = decryptMessageForRequestedBlock(
                `${block.data}`, shareBlockArgs.cipherTextOfBlock,
              ) as string;
              if (message) {
                const encryptedMessage = stringEncryption(
                  {
                    message,
                    issuerPrivateKey: shareBlockArgs.privateKey,
                    receiverPublicKey: recipientUser.publicKey,
                  },
                );
                await blockDB.update({
                  $push: {
                    shared: {
                      encryptedMessage,
                      recipientUser: recipientUser._id,
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
              return {
                isSuccess: false,
                errorMessage: e,
              };
            }
          }
          return {
            isSuccess: false,
            errorMessage: 'User not found!',
          };
        }
        return new GraphQLError(
          'No block found Or you are not the owner of the block, and hence can not share the block',
        );
      }
      return new GraphQLError(contract.errors() || 'Missing fields');
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('shareBlock', e);
  }
}

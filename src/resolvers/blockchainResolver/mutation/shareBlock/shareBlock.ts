import { GraphQLError } from 'graphql';
import { TPublicLedger, TShareBlockArgs } from '../../../../generated/graphql';
import { decryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import ValidationContract from '../../../../utis/validator/validator';
import { stringEncryption } from './publicKeyCryptoSystem';
import userHash from '../../../../utis/userHash/userHash';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  context: any,
) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (!tokenContent.error) {
      const contract = new ValidationContract();
      contract.isRequired(shareBlockArgs.recipientUserId, 'recipientUserId is required');
      contract.isRequired(shareBlockArgs.privateKey, 'sender\'s privateKey is required');
      if (contract.isValid()) {
        if (shareBlockArgs.recipientUserId === tokenContent.userId) {
          return {
            shareStatus: false,
            message: 'You can\'t share the block to your self.',
          };
        }
        const block = await BlockModel
          .findOne({
            _id: shareBlockArgs.blockId,
            ownerId: tokenContent.userId,
          })
          .lean() as TPublicLedger;
        if (block) {
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
                await BlockModel
                  .findByIdAndUpdate(
                    {
                      _id: shareBlockArgs.blockId,
                    },
                    {
                      $push: {
                        shared: {
                          encryptedMessage,
                          recipientUser,
                          sharedAt: new Date(),
                        },
                      },
                    },
                  );
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
    return new GraphQLError(tokenContent.error || 'Authentication token not present');
  } catch (e) {
    console.log('shareBlock e()', e);
    throw new GraphQLError(`Internal server shareBlock e() : ${e}`);
  }
}

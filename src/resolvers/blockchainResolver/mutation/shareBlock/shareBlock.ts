// @ts-ignore
import { GraphQLError } from 'graphql';
import { ReturnedUser, TPublicLedger, TShareBlockArgs } from '../../../../generated/graphql';
import { decryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import UserModel from '../../../../models/UserModel';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  context: any,
) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
      if (shareBlockArgs.recipientUserId === tokenContent.userId) {
        return {
          shareStatus: false,
          message: 'You can\'t share the block to your self.',
        };
      }
      const block = await BlockModel.findById(shareBlockArgs.blockId).lean() as TPublicLedger;
      if (block) {
        if (block.ownerId !== tokenContent.userId) {
          const recipientUser = await UserModel.findById(
            shareBlockArgs.recipientUserId,
          ).lean() as ReturnedUser;
          if (recipientUser) {
            const originalMessage = decryptMessageForRequestedBlock(
              block.data, shareBlockArgs.cipherTextOfBlock,
            );
            /*
            * create signature using message and public key of receiver
            * send this signature and message to receiver
            * receiver will use the signature, with private and message
            *  to validate the authenticity of the flow
            * */
            return {
              shareStatus: true,
              message: 'nns',
            };
          }
          return {
            shareStatus: false,
            message: 'User not found, please ask the user to join the chain.',
          };
        }
        return new GraphQLError('You are not the owner of the block.');
      }
      return new GraphQLError('No block found.');
    }
    return new GraphQLError('Authentication token not present');
  } catch (e) {
    console.log('shareBlock e()', e);
    throw new GraphQLError('Internal server e(): shareBlock ');
  }
}

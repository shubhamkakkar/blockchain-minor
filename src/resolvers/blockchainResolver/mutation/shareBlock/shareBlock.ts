// @ts-ignore
import { GraphQLError } from 'graphql';
import { ReturnedUser, TPublicLedger, TShareBlockArgs } from '../../../../generated/graphql';
import { decryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import UserModel from '../../../../models/UserModel';

export default async function shareBlock(
  /* TODO: update the typedef respectively to receive the following as well inside sharedBlockArgs
  * this privateKey is issuerPrivateKey
  */
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
            /* TODO
            * userId will be used to get the user's publicKey to be passed in stringEncryption()
            * use stringEncryption() to generate the encrypted version of the block's message
            *  which will be returned below
            * */
            return {
              shareStatus: 'success',
              message: originalMessage, // TODO: instead of this, return the encrypted message
            };
          }
          /*
          * TODO:
          * make a getUser query which will return all the users [full information] as
          * frontend will have a dropdown of user's to be selected as a sender,
          * this drop down will show 'name - email', which under the hood will send the userid
          * */

          /*
          * TODO: once the above todos are completed
          * make a mutation in User mutation's
          * getMySharedBlocs() ->  this will follow the param's setup of verification()
          * */
          return {
            shareStatus: 'fail',
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
    throw new GraphQLError(`Internal server shareBlock e() : ${e}`);
  }
}

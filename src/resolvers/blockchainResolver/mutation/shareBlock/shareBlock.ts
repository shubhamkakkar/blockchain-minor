// @ts-ignore
import { GraphQLError } from 'graphql';
import { ReturnedUser, TPublicLedger, TShareBlockArgs } from '../../../../generated/graphql';
import { decryptMessageForRequestedBlock, verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import UserModel from '../../../../models/UserModel';
import ValidationContract from '../../../../utis/validator/validator';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  context: any,
) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
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
          const recipientUser = await UserModel.findById(
            shareBlockArgs.recipientUserId,
          ).lean() as ReturnedUser;
          if (recipientUser) {
            let isSuccess: boolean = true;
            try {
              decryptMessageForRequestedBlock(
                `${block.data}sd`, shareBlockArgs.cipherTextOfBlock,
              );
            } catch (e) {
              isSuccess = false;
            }
            return {
              isSuccess,
            };
            /* TODO
            * userId will be used to get the user's publicKey to be passed in stringEncryption()
            * use stringEncryption() to generate the encrypted version of the block's message
            *  which will be returned below
            * handle originalMessage false
            * */
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
        return new GraphQLError(
          'No block found Or you are the owner of the block, and hence can not share the block',
        );
      }
      return new GraphQLError(contract.errors() || 'Missing fields');
    }
    return new GraphQLError('Authentication token not present');
  } catch (e) {
    console.log('shareBlock e()', e);
    throw new GraphQLError(`Internal server shareBlock e() : ${e}`);
  }
}

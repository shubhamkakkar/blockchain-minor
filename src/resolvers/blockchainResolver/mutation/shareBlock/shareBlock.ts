// @ts-ignore
import { GraphQLError } from 'graphql';
import { ReturnedUser, TPublicLedger, TShareBlockArgs } from '../../../../generated/graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';
import UserModel from '../../../../models/UserModel';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  context: any,
) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
    /*
   * check if the cipher key is the one used at the time of block creation
   * if true:
   *    * check if user exists
   *        if true: send the block to that user
   *    for this in frontend we need a dropdown of users,
   *    thus create a user route which returns all the user
   *     else: email user invite to the block
   * else: tell user the cipher ket is wrong
   * */
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
          console.log({ ...recipientUser });

          if (recipientUser) {
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

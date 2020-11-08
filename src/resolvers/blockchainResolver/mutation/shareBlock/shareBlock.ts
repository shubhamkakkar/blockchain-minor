// @ts-ignore
import { GraphQLError } from 'graphql';
import { TShareBlockArgs } from '../../../../generated/graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import BlockModel from '../../../../models/BlockModel';

export default async function shareBlock(
  { shareBlockArgs }: { shareBlockArgs: TShareBlockArgs },
  context: any,
) {
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

    const block = await BlockModel.findById(shareBlockArgs.blockId).lean();
    console.log({ block });
  }
  throw new GraphQLError('Authentication token not present');
}

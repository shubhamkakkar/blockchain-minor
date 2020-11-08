// @ts-ignore
import { GraphQLError } from 'graphql';
import { TShareBlockArgs } from '../../../../generated/graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';

export default function shareBlock(
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
  }
  throw new GraphQLError('Authentication token not present');
}

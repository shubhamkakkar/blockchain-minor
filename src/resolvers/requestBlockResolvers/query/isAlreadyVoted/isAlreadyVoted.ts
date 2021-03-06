import { GraphQLError } from 'graphql';

import { USER_ROLE_TYPE } from 'src/constants';
import { Context } from 'src/context';
import { QueryIsAlreadyVotedArgs } from 'src/generated/graphql';
import RequestBlockModel from 'src/models/RequestBlockModel';

export default async function isAlreadyVoted(
  args: QueryIsAlreadyVotedArgs,
  { req: context }: Context,
) {
  if (context?.user?.role === USER_ROLE_TYPE.ADMIN) {
    const { blockId: _id } = args;
    const isAlreadyVotedBlock = await RequestBlockModel.findOne(
      { _id, votedUsers: { $in: [context.user?._id] } },
    );
    return !!isAlreadyVotedBlock;
  }
  return new GraphQLError('You do not have required permission to accept or deny');
}

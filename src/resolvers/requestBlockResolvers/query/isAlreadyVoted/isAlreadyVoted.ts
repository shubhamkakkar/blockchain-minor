import { GraphQLError } from 'graphql';

import { Context } from 'src/context';
import { QueryIsAlreadyVotedArgs } from 'src/generated/graphql';
import RequestBlockModel from 'src/models/RequestBlockModel';

export default async function isAlreadyVoted(
  args: QueryIsAlreadyVotedArgs,
  { req: context }: Context,
) {
  if (context?.user?.role === 'admin') {
    const { blockId: _id } = args;
    const isAlreadyVotedBlock = await RequestBlockModel.findOne(
      { _id, votedUsers: { $in: [context.user?._id] } },
    );
    return !!isAlreadyVotedBlock;
  }
  return new GraphQLError('You do not have required permission to accept or deny');
}

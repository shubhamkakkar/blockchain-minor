import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import { TAcceptDenyParams } from '../../../../generated/graphql';
import RequestBlockModel from '../../../../models/RequestBlockModel';
import UserModel from '../../../../models/UserModel';
import ValidationContract from '../../../../utis/validator/validator';
import deletedTheBlockAndMoveToBlockchain from './deletedTheBlockAndMoveToBlockchain';
import deletedTheBlock from './deletedTheBlock';

export default async function acceptDeclineBlock(
  { acceptDenyParams }: { acceptDenyParams: TAcceptDenyParams }, context: any,
) {
  try {
    const tokenContent = await verifyToken(context.authorization);
    if (!tokenContent.error) {
      const {
        blockId,
        isAccept,
      } = acceptDenyParams;

      const contract = new ValidationContract();
      contract.isRequired(blockId, 'blockId is required');
      if (!contract.isValid()) {
        return new GraphQLError(contract.errors() || 'Review Signup information');
      }

      const keyToUpdate = isAccept ? 'acceptCount' : 'rejectCount';
      const requestedBlock = await RequestBlockModel.findById(blockId);
      if (requestedBlock) {
        const {
          rejectCount,
          acceptCount,
          message,
          userId,
          votedUsers,
        } = requestedBlock.toObject();
        if (userId === tokenContent.userId) {
          return new GraphQLError('You are the owner of the block');
        }
        if (votedUsers.includes(tokenContent.userId)) {
          return new GraphQLError('You have already voted');
        }
        await RequestBlockModel.findOneAndUpdate(
          { _id: blockId },
          { $inc: { [keyToUpdate]: 1 }, $push: { votedUsers: tokenContent.userId } },
        );

        const userCount = await UserModel.countDocuments({ _id: { $ne: tokenContent.userId } });
        if ((acceptCount + 1) >= 0.51 * userCount) {
          await deletedTheBlockAndMoveToBlockchain(message, blockId, tokenContent.userId);
        } else if (rejectCount >= 0.51 * userCount) {
          await deletedTheBlock(blockId);
        }
        return {
          acceptCount: isAccept ? acceptCount + 1 : acceptCount,
          rejectCount: isAccept ? rejectCount : rejectCount + 1,
        };
      }
      return new GraphQLError('Block not found');
    }
    return new GraphQLError(tokenContent.error);
  } catch (e) {
    console.log('acceptDeclineBlock e()', e);
    throw new GraphQLError('Internal server e(): acceptDeclineBlock ');
  }
}

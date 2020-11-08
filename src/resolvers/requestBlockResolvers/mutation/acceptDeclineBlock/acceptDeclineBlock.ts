import { GraphQLError } from 'graphql';
import { verifyToken } from '../../../../utis/jwt/jwt';
import { TAcceptDenyParams } from '../../../../generated/graphql';
import RequestBlockModel from '../../../../models/RequestBlockModel';
import UserModel from '../../../../models/UserModel';
import ValidationContract from '../../../../utis/validator/validator';
import deletedTheBlockAndMoveToBlockchain from './deletedTheBlockAndMoveToBlockchain';
import deletedTheBlock from './deletedTheBlock';

export default function acceptDeclineBlock(
  { acceptDenyParams }: { acceptDenyParams: TAcceptDenyParams }, context: any,
) {
  try {
    const tokenContent = verifyToken(context.authorization);
    if (tokenContent) {
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
      return RequestBlockModel
        .findOneAndUpdate(
          {
            _id: blockId,
            userId: { $ne: tokenContent.userId },
            votedUsers: { $nin: [tokenContent.userId] },
          },
          { $inc: { [keyToUpdate]: 1 }, $push: { votedUsers: tokenContent.userId } },
          { new: true },
        )
        .then(async (block: any) => {
          if (block) {
            const {
              rejectCount,
              acceptCount,
              message,
            } = block;
            const userCount = await UserModel.countDocuments({ _id: { $ne: tokenContent.userId } });
            if (acceptCount >= 0.51 * userCount) {
              await deletedTheBlockAndMoveToBlockchain(message, blockId, tokenContent.userId);
            } else if (rejectCount >= 0.51 * userCount) {
              await deletedTheBlock(blockId);
            }
            return block;
          }
          return new GraphQLError('Either you are the owner of the block, you have already voted for the block, or the block doesn\'t exists');
        })
        .catch((er) => {
          console.log('acceptDeclineBlock failed', er);
          return new GraphQLError('acceptDeclineBlock failed', er);
        });
    }
    return new GraphQLError('Authentication token not present');
  } catch (e) {
    console.log('acceptDeclineBlock e()', e);
    throw new GraphQLError('Internal server e(): acceptDeclineBlock ');
  }
}

import { GraphQLError } from 'graphql';

import deletedTheBlockAndMoveToBlockchain from './deletedTheBlockAndMoveToBlockchain';
import deletedTheBlock from './deletedTheBlock';

import { TAcceptDenyParams } from 'src/generated/graphql';
import RequestBlockModel from 'src/models/RequestBlockModel';
import UserModel from 'src/models/UserModel';
import ValidationContract from 'src/utis/validator/validator';
import { Context } from 'src/context';
import { resetPublicLedgerCache, resetDanglingBlocksCache } from 'src/utis/redis/redis';
import errorHandler from 'src/utis/errorHandler/errorHandler';

export default async function acceptDeclineBlock(
  { acceptDenyParams }: { acceptDenyParams: TAcceptDenyParams },
  { req: context, redisClient }: Context,
) {
  try {
    if (context.user) {
      const {
        blockId,
        isAccept,
      } = acceptDenyParams;
      if (context.user.role === 'admin') {
        const contract = new ValidationContract();
        contract.isRequired(blockId, 'blockId is required');
        if (!contract.isValid()) {
          return new GraphQLError(contract.errors() || 'Review information');
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
          if (userId === context.user._id) {
            return new GraphQLError('You are the owner of the block');
          }
          if (votedUsers.includes(context.user._id)) {
            return new GraphQLError('You have already voted');
          }

          requestedBlock.update(
            { $inc: { [keyToUpdate]: 1 }, $push: { votedUsers: context.user._id } },
            async (er) => {
              if (er) {
                return new GraphQLError(er);
              }
              const adminUserCount = await UserModel
                .countDocuments({ _id: { $ne: userId }, role: 'admin' });

              if (isAccept) {
                if (adminUserCount === 1 || ((acceptCount + 1) >= 0.51 * adminUserCount)) {
                  await deletedTheBlockAndMoveToBlockchain(message, blockId, userId);
                  resetPublicLedgerCache(redisClient);
                }
              } else if (adminUserCount === 1 || (rejectCount + 1) >= 0.51 * adminUserCount) {
                await deletedTheBlock(blockId);
              }
              resetDanglingBlocksCache(redisClient);
              return 0;
            },
          );

          return {
            acceptCount: isAccept ? acceptCount + 1 : acceptCount,
            rejectCount: isAccept ? rejectCount : rejectCount + 1,
          };
        }
        return new GraphQLError('Block not found');
      }
      return new GraphQLError('You do not have required permission to accept or deny');
    }
    return new GraphQLError('AUTHENTICATION NOT PROVIDED');
  } catch (e) {
    return errorHandler('acceptDeclineBlock', e);
  }
}

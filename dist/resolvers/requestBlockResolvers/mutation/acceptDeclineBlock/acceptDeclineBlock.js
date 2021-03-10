"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const deletedTheBlockAndMoveToBlockchain_1 = __importDefault(require("./deletedTheBlockAndMoveToBlockchain"));
const deletedTheBlock_1 = __importDefault(require("./deletedTheBlock"));
const RequestBlockModel_1 = __importDefault(require("src/models/RequestBlockModel"));
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const validator_1 = __importDefault(require("src/utis/validator/validator"));
const redis_1 = require("src/utis/redis/redis");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
const constants_1 = require("src/constants");
async function acceptDeclineBlock({ acceptDenyParams }, { req: context, redisClient }) {
    try {
        if (context.user) {
            const { blockId, isAccept, } = acceptDenyParams;
            if (context.user.role === constants_1.USER_ROLE_TYPE.ADMIN) {
                const contract = new validator_1.default();
                contract.isRequired(blockId, 'blockId is required');
                if (!contract.isValid()) {
                    return new graphql_1.GraphQLError(contract.errors() || 'Review information');
                }
                const keyToUpdate = isAccept ? 'acceptCount' : 'rejectCount';
                const requestedBlock = await RequestBlockModel_1.default.findById(blockId);
                if (requestedBlock) {
                    const { rejectCount, acceptCount, message, messageType, userId, votedUsers, } = requestedBlock.toObject();
                    if (userId === context.user._id) {
                        return new graphql_1.GraphQLError('You are the owner of the block');
                    }
                    if (votedUsers.includes(context.user._id)) {
                        return new graphql_1.GraphQLError('You have already voted');
                    }
                    requestedBlock.update({ $inc: { [keyToUpdate]: 1 }, $push: { votedUsers: context.user._id } }, async (er) => {
                        if (er) {
                            return new graphql_1.GraphQLError(er);
                        }
                        const adminUserCount = await UserModel_1.default
                            .countDocuments({ _id: { $ne: userId }, role: constants_1.USER_ROLE_TYPE.ADMIN });
                        if (isAccept) {
                            if (adminUserCount === 1 || ((acceptCount + 1) >= 0.51 * adminUserCount)) {
                                await deletedTheBlockAndMoveToBlockchain_1.default(message, messageType, blockId, userId);
                                redis_1.resetPublicLedgerCache(redisClient);
                            }
                        }
                        else if (adminUserCount === 1 || (rejectCount + 1) >= 0.51 * adminUserCount) {
                            await deletedTheBlock_1.default(blockId);
                        }
                        redis_1.resetDanglingBlocksCache(redisClient);
                        return 0;
                    });
                    return {
                        acceptCount: isAccept ? acceptCount + 1 : acceptCount,
                        rejectCount: isAccept ? rejectCount : rejectCount + 1,
                    };
                }
                return new graphql_1.GraphQLError('Block not found');
            }
            return new graphql_1.GraphQLError('You do not have required permission to accept or deny');
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('acceptDeclineBlock', e);
    }
}
exports.default = acceptDeclineBlock;

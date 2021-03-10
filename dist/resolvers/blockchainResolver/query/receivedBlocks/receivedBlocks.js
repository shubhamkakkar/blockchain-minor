"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const userHash_1 = __importDefault(require("src/utis/userHash/userHash"));
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const constants_1 = require("src/constants");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function receivedBlocks({ req: context, redisClient, customRedisGet }) {
    var _a;
    try {
        if (context.user) {
            try {
                const cachedMyReceivedBlocks = await customRedisGet(constants_1.REDIS_KEYS.MY_RECEIVED_BLOCKS);
                if (cachedMyReceivedBlocks) {
                    return cachedMyReceivedBlocks;
                }
                const blocks = await BlockModel_1.default.find({
                    'shared.recipientUser.email': (_a = context.user) === null || _a === void 0 ? void 0 : _a._id,
                }, { 'shared.sharedAt': 1, ownerId: 1 }).lean();
                if (blocks) {
                    // @ts-ignore
                    for (const block of blocks) {
                        block.sharedBy = await userHash_1.default(block.ownerId);
                        block.sharedAt = block.shared[0].sharedAt;
                    }
                    redisClient.set(constants_1.REDIS_KEYS.MY_RECEIVED_BLOCKS, JSON.stringify(blocks));
                    return blocks;
                }
                return new graphql_1.GraphQLError('Either the block does not exists, or it is not shared with you');
            }
            catch (e) {
                errorHandler_1.default('receivedBlocks', e);
            }
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('receivedBlocks', e);
    }
}
exports.default = receivedBlocks;

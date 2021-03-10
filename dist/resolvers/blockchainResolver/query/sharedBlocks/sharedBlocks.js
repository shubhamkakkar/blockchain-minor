"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const constants_1 = require("src/constants");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function sharedBlocks({ req: context, redisClient, customRedisGet }) {
    var _a;
    if (context.user) {
        try {
            const cachedMySharedBlocks = await customRedisGet(constants_1.REDIS_KEYS.MY_SHARED_BLOCKS);
            if (cachedMySharedBlocks) {
                return cachedMySharedBlocks;
            }
            const blocks = await BlockModel_1.default.find({ 'shared.0': { $exists: true }, ownerId: (_a = context.user) === null || _a === void 0 ? void 0 : _a._id }, { shared: 1, _id: 0 }).lean();
            const allSharedBlocks = [];
            blocks.forEach((block) => {
                allSharedBlocks.push(...block.shared);
            });
            redisClient.set(constants_1.REDIS_KEYS.MY_SHARED_BLOCKS, JSON.stringify(allSharedBlocks));
            return allSharedBlocks;
        }
        catch (e) {
            return errorHandler_1.default('sharedBlocks', e);
        }
    }
    return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
}
exports.default = sharedBlocks;

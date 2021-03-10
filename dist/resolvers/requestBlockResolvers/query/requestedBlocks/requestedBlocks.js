"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const RequestBlockModel_1 = __importDefault(require("src/models/RequestBlockModel"));
const userHash_1 = __importDefault(require("src/utis/userHash/userHash"));
const constants_1 = require("src/constants");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function requestedBlocks({ isUserOnly }, { req: context, redisClient, customRedisGet }) {
    var _a;
    try {
        if (context.user) {
            const redisKey = isUserOnly ? 'MY_REQUESTED_BLOCKS' : 'REQUESTED_BLOCKS';
            const cachedRequestedBlocks = await customRedisGet(constants_1.REDIS_KEYS[redisKey]);
            if (cachedRequestedBlocks) {
                return cachedRequestedBlocks;
            }
            const searchCondition = isUserOnly ? { userId: { $in: [(_a = context.user) === null || _a === void 0 ? void 0 : _a._id] } } : {};
            const requestBlocks = await RequestBlockModel_1.default
                .find(searchCondition)
                .sort([['requestAt', 'descending']]);
            const modifiedRequestedBlocks = [];
            if (isUserOnly) {
                requestBlocks.forEach((requestedBlock) => {
                    const objectifiedRequestedBlock = requestedBlock.toObject();
                    objectifiedRequestedBlock.user = context.user;
                    modifiedRequestedBlocks.push(objectifiedRequestedBlock);
                });
            }
            else {
                for (const requestedBlock of requestBlocks) {
                    const objectifiedRequestedBlock = requestedBlock.toObject();
                    objectifiedRequestedBlock.user = await userHash_1.default(objectifiedRequestedBlock.userId);
                    modifiedRequestedBlocks.push(objectifiedRequestedBlock);
                }
            }
            redisClient.set(constants_1.REDIS_KEYS[redisKey], JSON.stringify(modifiedRequestedBlocks));
            return modifiedRequestedBlocks;
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('requestedBlocks', e);
    }
}
exports.default = requestedBlocks;

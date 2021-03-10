"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const jwt_1 = require("src/utis/jwt/jwt");
const RequestBlockModel_1 = __importDefault(require("src/models/RequestBlockModel"));
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
const redis_1 = require("src/utis/redis/redis");
async function requestDanglingBlock({ requestBlockData }, { req: context, redisClient }) {
    try {
        if (context.user) {
            const { message, cipherKeyForTheMessage, messageType, } = requestBlockData;
            const newRequestedBlock = new RequestBlockModel_1.default({
                message: jwt_1.encryptMessageForRequestedBlock(message, cipherKeyForTheMessage),
                userId: context.user._id,
                messageType,
            });
            await newRequestedBlock.save();
            redis_1.resetDanglingBlocksCache(redisClient);
            return newRequestedBlock.toObject();
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('requestDanglingBlock', e);
    }
}
exports.default = requestDanglingBlock;

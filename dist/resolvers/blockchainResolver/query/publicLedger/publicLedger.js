"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const constants_1 = require("src/constants");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
const userHash_1 = __importDefault(require("src/utis/userHash/userHash"));
async function publicLedger({ req: context, redisClient, customRedisGet }, myEntries = false) {
    var _a, _b;
    if (context.user) {
        const isAdmin = ((_a = context.user) === null || _a === void 0 ? void 0 : _a.role) === constants_1.USER_ROLE_TYPE.ADMIN;
        const condition = {};
        const redisKey = isAdmin ? 'ALL_ENTRIES_ADMIN' : 'ALL_ENTRIES';
        try {
            if (!myEntries) {
                const cachedPublicLedger = await customRedisGet(constants_1.REDIS_KEYS[redisKey]);
                if (cachedPublicLedger) {
                    return cachedPublicLedger;
                }
            }
            else {
                condition.ownerId = (_b = context.user) === null || _b === void 0 ? void 0 : _b._id;
            }
            const blocks = await BlockModel_1.default
                .find(condition)
                // .select('-nounce-timeStamp-prevHash')
                .populate({
                path: 'shared',
                populate: 'recipientUser',
            })
                .sort([['createdAt', 'descending']]);
            if (isAdmin && !myEntries) {
                const modifiedBlock = [];
                for (const block of blocks) {
                    const objectifiedBlock = block.toObject();
                    objectifiedBlock.ownerProfile = await userHash_1.default(objectifiedBlock.ownerId, false);
                    modifiedBlock.push(objectifiedBlock);
                }
                redisClient.set(constants_1.REDIS_KEYS[redisKey], JSON.stringify(modifiedBlock));
                return modifiedBlock;
            }
            if (!myEntries)
                redisClient.set(constants_1.REDIS_KEYS[redisKey], JSON.stringify(blocks));
            return blocks;
        }
        catch (e) {
            return errorHandler_1.default('publicLedger', e);
        }
    }
    return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
}
exports.default = publicLedger;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const constants_1 = require("src/constants");
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function searchUser({ filter }, { req: context, customRedisSetEx, customRedisGet }) {
    try {
        if (!context.user) {
            return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
        }
        const redisKey = `${constants_1.REDIS_KEYS.SEARCH_USER}-${filter}`;
        const cachedSearchUser = await customRedisGet(redisKey);
        if (cachedSearchUser) {
            return cachedSearchUser;
        }
        const indexSearchResult = await UserModel_1.default.find({ $text: { $search: filter } });
        if (indexSearchResult.length) {
            customRedisSetEx(redisKey, indexSearchResult);
            return indexSearchResult;
        }
        const regexUserSearch = await UserModel_1.default.find({
            $or: [
                { firstName: { $regex: `^${filter}`, $options: 'i' } },
                { lastName: { $regex: `^${filter}`, $options: 'i' } },
                { middleName: { $regex: `^${filter}`, $options: 'i' } },
                { email: { $regex: `^${filter}`, $options: 'i' } },
            ],
        });
        customRedisSetEx(redisKey, regexUserSearch);
        return regexUserSearch;
    }
    catch (e) {
        return errorHandler_1.default('searchUser', e);
    }
}
exports.default = searchUser;
/**
 TODO
 * make a 10 minute redis cache for this searhc for every "args.filter" and search in redis first;
 * make a 1 day redis cache for a block for public key cryptosystem
 */

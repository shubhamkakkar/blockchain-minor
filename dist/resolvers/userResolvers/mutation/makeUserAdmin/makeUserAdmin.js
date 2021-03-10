"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
const redis_1 = require("src/utis/redis/redis");
const constants_1 = require("src/constants");
async function makeUserAdmin(userId, { req: context, redisClient }) {
    var _a;
    try {
        if (!context.user) {
            return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
        }
        if (((_a = context.user) === null || _a === void 0 ? void 0 : _a.role) === constants_1.USER_ROLE_TYPE.ADMIN) {
            const user = await UserModel_1.default.findById(userId).lean();
            if (user) {
                if (user.role === constants_1.USER_ROLE_TYPE.ADMIN) {
                    return new graphql_1.GraphQLError('User is already admin');
                }
                await UserModel_1.default.findOneAndUpdate({
                    _id: userId,
                }, {
                    role: constants_1.USER_ROLE_TYPE.ADMIN,
                });
                redis_1.resetUsersCache(redisClient);
                return true;
            }
            return new graphql_1.GraphQLError('User not found');
        }
        return new graphql_1.GraphQLError('You can not make a user admin');
    }
    catch (e) {
        return errorHandler_1.default('makeUserAdmin', e);
    }
}
exports.default = makeUserAdmin;

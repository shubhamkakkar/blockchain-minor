"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const constants_1 = require("src/constants");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function allUsers({ req: context, redisClient, customRedisGet }) {
    try {
        let conditions = {};
        if (context.user) {
            conditions = {
                _id: { $ne: context.user._id },
            };
        }
        const cachedUsers = await customRedisGet(constants_1.REDIS_KEYS.ALL_USERS);
        if (cachedUsers) {
            return cachedUsers;
        }
        const users = await UserModel_1.default.find(conditions).select('-password');
        redisClient.set(constants_1.REDIS_KEYS.ALL_USERS, JSON.stringify(users));
        return users;
    }
    catch (e) {
        return errorHandler_1.default('allUsers', e);
    }
}
exports.default = allUsers;

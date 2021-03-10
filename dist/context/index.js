"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const redis_1 = __importDefault(require("redis"));
const jwt_1 = require("src/utis/jwt/jwt");
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const constants_1 = require("src/constants");
const client = redis_1.default.createClient({
    host: constants_1.REDIS_DB.REDIS_DB_HOST,
    port: Number(constants_1.REDIS_DB.REDIS_DB_PORT),
});
const customRedisGet = async (key) => {
    const redisCache = await util_1.promisify(client.get).bind(client)(key);
    if (redisCache) {
        return JSON.parse(redisCache);
    }
    return null;
};
const customRedisSetEx = async (key, value, seconds = constants_1.REDIS_KEY_DURATION.TEN_MINUTES) => util_1.promisify(client.setex).bind(client)(key, seconds, JSON.stringify(value));
async function checkAuth(req) {
    const token = req.headers.authorization;
    let user;
    if (token) {
        const { id: userId } = await jwt_1.verifyToken(token);
        if (userId) {
            const dbUser = await UserModel_1.default.findById(userId).select('-password');
            if (dbUser) {
                user = dbUser.toObject();
            }
        }
    }
    return user;
}
async function context({ req }) {
    try {
        return {
            req: { user: await checkAuth(req) }, redisClient: client, customRedisGet, customRedisSetEx,
        };
    }
    catch (e) {
        console.log('context e()', e);
        throw new Error('context e()');
    }
}
exports.default = context;

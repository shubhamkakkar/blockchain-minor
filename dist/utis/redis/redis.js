"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUsersCache = exports.resetDanglingBlocksCache = exports.resetPublicLedgerCache = void 0;
const constants_1 = require("src/constants");
function resetPublicLedgerCache(redisClient) {
    redisClient.del(constants_1.REDIS_KEYS.ALL_ENTRIES);
    redisClient.del(constants_1.REDIS_KEYS.ALL_ENTRIES_ADMIN);
    redisClient.del(constants_1.REDIS_KEYS.MY_ENTRIES);
    redisClient.del(constants_1.REDIS_KEYS.MY_RECEIVED_BLOCKS);
    redisClient.del(constants_1.REDIS_KEYS.MY_SHARED_BLOCKS);
}
exports.resetPublicLedgerCache = resetPublicLedgerCache;
function resetDanglingBlocksCache(redisClient) {
    redisClient.del(constants_1.REDIS_KEYS.MY_REQUESTED_BLOCKS);
    redisClient.del(constants_1.REDIS_KEYS.REQUESTED_BLOCKS);
}
exports.resetDanglingBlocksCache = resetDanglingBlocksCache;
function resetUsersCache(redisClient) {
    redisClient.del(constants_1.REDIS_KEYS.ALL_USERS);
    redisClient.eval(`EVAL "return redis.call('del', unpack(redis.call('keys', ARGV[1])))" 0 prefix:[${constants_1.REDIS_KEYS.SEARCH_USER}]`);
}
exports.resetUsersCache = resetUsersCache;

import { RedisClient } from 'redis';

import { REDIS_KEYS } from 'src/constants';

export function resetPublicLedgerCache(redisClient: RedisClient) {
  redisClient.del(REDIS_KEYS.ALL_ENTRIES);
  redisClient.del(REDIS_KEYS.MY_ENTRIES);
  redisClient.del(REDIS_KEYS.MY_RECEIVED_BLOCKS);
  redisClient.del(REDIS_KEYS.MY_SHARED_BLOCKS);
}

export function resetDanglingBlocksCache(redisClient: RedisClient) {
  redisClient.del(REDIS_KEYS.MY_REQUESTED_BLOCKS);
  redisClient.del(REDIS_KEYS.REQUESTED_BLOCKS);
}

export function resetUsersCache(redisClient: RedisClient) {
  redisClient.del(REDIS_KEYS.ALL_USERS);
}

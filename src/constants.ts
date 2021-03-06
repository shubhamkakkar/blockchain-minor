import dotenv from 'dotenv';

dotenv.config();
const { MONGO_URI_DEV = '', REDIS_DB_HOST, REDIS_DB_PORT } = process.env;

const REDIS_KEYS = {
  ALL_USERS: 'users/allUsers',
  MY_REQUESTED_BLOCKS: 'requestedBlocks/myRequestedBlocks',
  REQUESTED_BLOCKS: 'requestedBlocks/requestedBlocks',
  MY_ENTRIES: 'publicLedger/myEntries',
  ALL_ENTRIES: 'publicLedger/allEntries',
  MY_RECEIVED_BLOCKS: 'publicLedger/myReceivedBlocks',
  MY_SHARED_BLOCKS: 'publicLedger/mySharedBlocks',
};

const MONGO_DB = {
  MONGO_URI_DEV,
};

const REDIS_DB = {
  REDIS_DB_HOST,
  REDIS_DB_PORT,
};

enum USER_ROLE_TYPE {
  USER = 'user',
  ADMIN = 'admin',
}

export { MONGO_DB, REDIS_DB, REDIS_KEYS, USER_ROLE_TYPE };

import dotenv from 'dotenv';

dotenv.config();
const { MONGO_URI_DEV = '', REDIS_DB_HOST, REDIS_DB_PORT, REDIS_URL } = process.env;

enum REDIS_KEYS {
  ALL_USERS = 'users/allUsers',
  SEARCH_USER = 'users/searchUsers',
  MY_REQUESTED_BLOCKS = 'requestedBlocks/myRequestedBlocks',
  REQUESTED_BLOCKS = 'requestedBlocks/requestedBlocks',
  MY_ENTRIES = 'publicLedger/myEntries',
  ALL_ENTRIES = 'publicLedger/allEntries',
  ALL_ENTRIES_ADMIN = 'publicLedger/allEntriesAdmin',
  MY_RECEIVED_BLOCKS = 'publicLedger/myReceivedBlocks',
  MY_SHARED_BLOCKS = 'publicLedger/mySharedBlocks',
}

const MONGO_DB = {
  MONGO_URI_DEV,
};

const REDIS_DB = {
  REDIS_DB_HOST,
  REDIS_DB_PORT,
  REDIS_URL,
};

enum USER_ROLE_TYPE {
  USER = 'user',
  ADMIN = 'admin',
}

enum REDIS_KEY_DURATION {
  TEN_MINUTES = 60 * 10
}

export {
  MONGO_DB,
  REDIS_DB,
  REDIS_KEY_DURATION,
  REDIS_KEYS,
  USER_ROLE_TYPE,
};

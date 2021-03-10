"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_ROLE_TYPE = exports.REDIS_KEYS = exports.REDIS_KEY_DURATION = exports.REDIS_DB = exports.MONGO_DB = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGO_URI_DEV = '', REDIS_DB_HOST, REDIS_DB_PORT, REDIS_URL } = process.env;
var REDIS_KEYS;
(function (REDIS_KEYS) {
    REDIS_KEYS["ALL_USERS"] = "users/allUsers";
    REDIS_KEYS["SEARCH_USER"] = "users/searchUsers";
    REDIS_KEYS["MY_REQUESTED_BLOCKS"] = "requestedBlocks/myRequestedBlocks";
    REDIS_KEYS["REQUESTED_BLOCKS"] = "requestedBlocks/requestedBlocks";
    REDIS_KEYS["MY_ENTRIES"] = "publicLedger/myEntries";
    REDIS_KEYS["ALL_ENTRIES"] = "publicLedger/allEntries";
    REDIS_KEYS["ALL_ENTRIES_ADMIN"] = "publicLedger/allEntriesAdmin";
    REDIS_KEYS["MY_RECEIVED_BLOCKS"] = "publicLedger/myReceivedBlocks";
    REDIS_KEYS["MY_SHARED_BLOCKS"] = "publicLedger/mySharedBlocks";
})(REDIS_KEYS || (REDIS_KEYS = {}));
exports.REDIS_KEYS = REDIS_KEYS;
const MONGO_DB = {
    MONGO_URI_DEV,
};
exports.MONGO_DB = MONGO_DB;
const REDIS_DB = {
    REDIS_DB_HOST,
    REDIS_DB_PORT,
    REDIS_URL,
};
exports.REDIS_DB = REDIS_DB;
var USER_ROLE_TYPE;
(function (USER_ROLE_TYPE) {
    USER_ROLE_TYPE["USER"] = "user";
    USER_ROLE_TYPE["ADMIN"] = "admin";
})(USER_ROLE_TYPE || (USER_ROLE_TYPE = {}));
exports.USER_ROLE_TYPE = USER_ROLE_TYPE;
var REDIS_KEY_DURATION;
(function (REDIS_KEY_DURATION) {
    REDIS_KEY_DURATION[REDIS_KEY_DURATION["TEN_MINUTES"] = 600] = "TEN_MINUTES";
})(REDIS_KEY_DURATION || (REDIS_KEY_DURATION = {}));
exports.REDIS_KEY_DURATION = REDIS_KEY_DURATION;

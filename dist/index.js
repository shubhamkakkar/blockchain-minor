"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
const constants_1 = require("src/constants");
mongoose_1.default.connect(constants_1.MONGO_DB.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('DB connected');
    return server_1.default();
})
    .catch((er) => {
    console.log('failed to connect to mongoose', er);
});

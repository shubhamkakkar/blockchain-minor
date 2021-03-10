"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const graphql_1 = require("src/generated/graphql");
const sharedSchema = new mongoose_1.Schema({
    encryptedMessage: {
        type: String,
        required: true,
    },
    recipientUser: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    sharedAt: {
        type: Date,
        default: new Date(),
    },
});
const BlockModel = new mongoose_1.Schema({
    data: {
        type: String,
        required: true,
    },
    messageType: {
        type: graphql_1.RequestedBlockMessage,
        required: true,
    },
    prevHash: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    nounce: {
        type: Number,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    shared: {
        type: [sharedSchema],
        required: false,
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
}, { collection: 'Blockchain' });
exports.default = mongoose_1.model('BlockModel', BlockModel);

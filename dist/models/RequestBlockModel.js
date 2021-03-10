"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const graphql_1 = require("src/generated/graphql");
const RequestBlockSchema = new mongoose_1.Schema({
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: [
            graphql_1.RequestedBlockMessage.InsuranceInformation,
            graphql_1.RequestedBlockMessage.MedicalReports,
            graphql_1.RequestedBlockMessage.PersonalMedicalInformation,
        ],
        required: true,
    },
    requestAt: {
        type: Date,
        default: Date.now(),
    },
    acceptCount: {
        type: Number,
        default: 0,
    },
    rejectCount: {
        type: Number,
        default: 0,
    },
    votedUsers: {
        type: [String],
        default: [],
        required: true,
    },
}, { collection: 'RequestBlock' });
exports.default = mongoose_1.model('RequestBlock', RequestBlockSchema);

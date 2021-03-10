"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("src/constants");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: constants_1.USER_ROLE_TYPE.USER,
    },
}, { collection: 'User', autoIndex: true });
UserSchema.index({
    firstName: 'text', lastName: 'text', middleName: 'text', email: 'text',
});
UserSchema.index({
    firstName: 1,
    lastName: 1,
    middleName: 1,
    email: 1,
});
exports.default = mongoose_1.model('User', UserSchema);

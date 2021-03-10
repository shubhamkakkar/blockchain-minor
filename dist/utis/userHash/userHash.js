"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("src/models/UserModel"));
function userHash(userId, isTokenRequired = true) {
    return UserModel_1.default.findById(userId).select(isTokenRequired ? '' : '-token').lean();
}
exports.default = userHash;

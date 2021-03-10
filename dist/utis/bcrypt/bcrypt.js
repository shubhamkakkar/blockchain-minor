"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordCrypt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
async function generatePasswordCrypt(password) {
    return bcryptjs_1.default.hash(password, saltRounds)
        .then((hash) => hash)
        .catch((er) => console.log('generatePasswordCrypt*() e', er));
}
exports.generatePasswordCrypt = generatePasswordCrypt;

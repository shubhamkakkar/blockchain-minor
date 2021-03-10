"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMessageForRequestedBlock = exports.encryptMessageForRequestedBlock = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = (process.env.SECRET_JWT || '');
function generateToken(id) {
    return jsonwebtoken_1.default.sign({ id }, SECRET, { expiresIn: '365d' });
}
exports.generateToken = generateToken;
async function verifyToken(token) {
    try {
        return await jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch (e) {
        console.log('verifyToken e()', e);
        return {
            error: 'Authentication token not provided',
        };
    }
}
exports.verifyToken = verifyToken;
function encryptMessageForRequestedBlock(message, secretKey) {
    return jsonwebtoken_1.default.sign(message, secretKey);
}
exports.encryptMessageForRequestedBlock = encryptMessageForRequestedBlock;
function decryptMessageForRequestedBlock(message, secretKey) {
    try {
        return jsonwebtoken_1.default.verify(message, secretKey);
    }
    catch (e) {
        console.log('decryptMessageForRequestedBlock e()', e);
        return '';
    }
}
exports.decryptMessageForRequestedBlock = decryptMessageForRequestedBlock;

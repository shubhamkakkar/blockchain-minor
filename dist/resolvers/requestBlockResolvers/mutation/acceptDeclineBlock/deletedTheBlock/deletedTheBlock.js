"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestBlockModel_1 = __importDefault(require("src/models/RequestBlockModel"));
async function deletedTheBlock(blockId) {
    await RequestBlockModel_1.default.findByIdAndDelete(blockId);
}
exports.default = deletedTheBlock;

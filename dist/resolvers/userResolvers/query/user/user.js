"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function user({ req: context }) {
    try {
        if (context.user) {
            return context.user;
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('user', e);
    }
}
exports.default = user;

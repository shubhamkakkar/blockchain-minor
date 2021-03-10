"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const constants_1 = require("src/constants");
const RequestBlockModel_1 = __importDefault(require("src/models/RequestBlockModel"));
async function isAlreadyVoted(args, { req: context }) {
    var _a, _b;
    if (((_a = context === null || context === void 0 ? void 0 : context.user) === null || _a === void 0 ? void 0 : _a.role) === constants_1.USER_ROLE_TYPE.ADMIN) {
        const { blockId: _id } = args;
        const isAlreadyVotedBlock = await RequestBlockModel_1.default.findOne({ _id, votedUsers: { $in: [(_b = context.user) === null || _b === void 0 ? void 0 : _b._id] } });
        return !!isAlreadyVotedBlock;
    }
    return new graphql_1.GraphQLError('You do not have required permission to accept or deny');
}
exports.default = isAlreadyVoted;

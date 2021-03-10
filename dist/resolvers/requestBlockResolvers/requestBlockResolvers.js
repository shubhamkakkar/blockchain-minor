"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutation_1 = require("./mutation");
const query_1 = require("./query");
exports.default = {
    Query: {
        requestedBlocks: (parent, args, context) => query_1.requestedBlocks(args, context),
        myRequestedBlocks: (parent, args, context) => query_1.requestedBlocks({ isUserOnly: true }, context),
        isAlreadyVoted: (parent, args, context) => query_1.isAlreadyVoted(args, context),
    },
    Mutation: {
        requestDanglingBlock: (parent, args, context) => mutation_1.requestDanglingBlock(args, context),
        acceptDeclineBlock: (parent, args, context) => mutation_1.acceptDeclineBlock(args, context),
    },
};

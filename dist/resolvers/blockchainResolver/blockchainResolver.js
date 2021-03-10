"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const mutation_1 = require("./mutation");
exports.default = {
    Query: {
        publicLedger: (parent, args, context) => query_1.publicLedger(context),
        sharedBlocks: (parent, args, context) => query_1.sharedBlocks(context),
        receivedBlocks: (parent, args, context) => query_1.receivedBlocks(context),
        receivedBlock: (parent, { receivedBlockArgs }, context) => query_1.receivedBlock(receivedBlockArgs, context),
        myBlocks: (parent, args, context) => query_1.publicLedger(context, true),
        myBlock: (parent, { myBlockArgs }, context) => query_1.myBlock(myBlockArgs, context),
    },
    Mutation: {
        shareBlock: (parent, args, context) => mutation_1.shareBlock(args, context),
    },
};

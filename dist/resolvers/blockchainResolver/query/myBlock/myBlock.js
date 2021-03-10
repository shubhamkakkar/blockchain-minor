"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const jwt_1 = require("src/utis/jwt/jwt");
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function myBlock(args, { req: context }) {
    try {
        if (!context.user) {
            return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
        }
        const block = await BlockModel_1.default
            .findById(args.blockId)
            .select(['data', 'prevHash', 'ownerId', '-_id'])
            .lean();
        if (block) {
            if (block.ownerId.toString() === context.user._id.toString()) {
                const message = jwt_1.decryptMessageForRequestedBlock(`${block.data}`, args.cipherTextOfBlock);
                if (message) {
                    block.data = JSON.stringify(message);
                    return block;
                }
                return new graphql_1.GraphQLError('cipherTextOfBlock is incorrect');
            }
            return new graphql_1.GraphQLError('You are not the owner of the block');
        }
        return new graphql_1.GraphQLError('Block not found');
    }
    catch (e) {
        return errorHandler_1.default('myBlock', e);
    }
}
exports.default = myBlock;

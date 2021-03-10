"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const publicKeyCryptoSystem_1 = require("src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem");
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const userHash_1 = __importDefault(require("src/utis/userHash/userHash"));
async function receivedBlock(receivedBlockArgs, { req: context }) {
    try {
        if (context.user) {
            const block = await BlockModel_1.default.findOne({
                _id: receivedBlockArgs.blockId,
                'shared.recipientUser': context.user._id,
            }, {
                'shared.sharedAt': 1, 'shared.encryptedMessage': 1, ownerId: 1, _id: 0,
            }).lean();
            if (block) {
                const { encryptedMessage, sharedAt } = block.shared[0];
                const { publicKey: issuerPublicKey } = await userHash_1.default(block.ownerId);
                try {
                    const message = publicKeyCryptoSystem_1.verification({
                        issuerPublicKey,
                        receiverPrivateKey: receivedBlockArgs.privateKey,
                        encryptedMessage,
                    });
                    if (message) {
                        return {
                            message,
                            sharedAt,
                        };
                    }
                    return new graphql_1.GraphQLError('Validation failed');
                }
                catch (error) {
                    return new graphql_1.GraphQLError(error);
                }
            }
            return new graphql_1.GraphQLError('Either the block does not exists, or it is not shared with you');
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        console.log('Internal server error receivedBlock e()', e);
        throw new graphql_1.GraphQLError('Internal server error receivedBlock e()', e);
    }
}
exports.default = receivedBlock;

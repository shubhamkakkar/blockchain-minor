"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const jwt_1 = require("src/utis/jwt/jwt");
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
const validator_1 = __importDefault(require("src/utis/validator/validator"));
const publicKeyCryptoSystem_1 = require("src/utis/publicKeyCryptoSystem/publicKeyCryptoSystem");
const userHash_1 = __importDefault(require("src/utis/userHash/userHash"));
const redis_1 = require("src/utis/redis/redis");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
async function shareBlock({ shareBlockArgs }, { req: context, redisClient }) {
    try {
        if (context.user) {
            const contract = new validator_1.default();
            contract.isRequired(shareBlockArgs.recipientUserId, 'recipientUserId is required');
            contract.isRequired(shareBlockArgs.privateKey, 'sender\'s privateKey is required');
            if (contract.isValid()) {
                if (shareBlockArgs.recipientUserId === context.user._id) {
                    return {
                        shareStatus: false,
                        message: 'You can\'t share the block to your self.',
                    };
                }
                const blockDB = await BlockModel_1.default
                    .findOne({
                    _id: shareBlockArgs.blockId,
                    ownerId: context.user._id,
                });
                if (blockDB) {
                    const block = blockDB.toObject();
                    if (block
                        .shared
                        .find(({ recipientUser }) => recipientUser._id.toString() === shareBlockArgs.recipientUserId.toString())) {
                        return {
                            isSuccess: false,
                            errorMessage: 'Already shared with the user',
                        };
                    }
                    const recipientUser = await userHash_1.default(shareBlockArgs.recipientUserId);
                    if (recipientUser) {
                        try {
                            const message = jwt_1.decryptMessageForRequestedBlock(`${block.data}`, shareBlockArgs.cipherTextOfBlock);
                            if (message) {
                                const encryptedMessage = publicKeyCryptoSystem_1.stringEncryption({
                                    message,
                                    issuerPrivateKey: shareBlockArgs.privateKey,
                                    receiverPublicKey: recipientUser.publicKey,
                                });
                                await blockDB.update({
                                    $push: {
                                        shared: {
                                            encryptedMessage,
                                            recipientUser: recipientUser._id,
                                        },
                                    },
                                });
                                redis_1.resetPublicLedgerCache(redisClient);
                                return {
                                    isSuccess: true,
                                };
                            }
                            return {
                                isSuccess: false,
                                errorMessage: 'Failed to authenticate the block',
                            };
                        }
                        catch (e) {
                            return {
                                isSuccess: false,
                                errorMessage: e,
                            };
                        }
                    }
                    return {
                        isSuccess: false,
                        errorMessage: 'User not found!',
                    };
                }
                return new graphql_1.GraphQLError('No block found Or you are not the owner of the block, and hence can not share the block');
            }
            return new graphql_1.GraphQLError(contract.errors() || 'Missing fields');
        }
        return new graphql_1.GraphQLError('AUTHENTICATION NOT PROVIDED');
    }
    catch (e) {
        return errorHandler_1.default('shareBlock', e);
    }
}
exports.default = shareBlock;

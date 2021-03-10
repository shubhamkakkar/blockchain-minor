"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deletedTheBlock_1 = __importDefault(require("../deletedTheBlock"));
const Block_1 = __importDefault(require("src/Blokchain/Block"));
const BlockModel_1 = __importDefault(require("src/models/BlockModel"));
async function deletedTheBlockAndMoveToBlockchain(message, messageType, blockId, ownerId) {
    try {
        const [lastElementOfBlockchain] = await BlockModel_1.default.find().slice('array', -1).lean();
        let block;
        if (lastElementOfBlockchain) {
            block = new Block_1.default({ prevHash: lastElementOfBlockchain.hash, data: message, messageType });
        }
        else {
            block = new Block_1.default({ prevHash: '0', data: message, messageType });
        }
        // @ts-ignore
        block.ownerId = ownerId;
        const blockOfBlockChain = new BlockModel_1.default(block);
        await blockOfBlockChain.save();
        await deletedTheBlock_1.default(blockId);
    }
    catch (e) {
        console.log('deletedTheBlockAndMoveToBlockchain e()', e);
        throw e;
    }
}
exports.default = deletedTheBlockAndMoveToBlockchain;

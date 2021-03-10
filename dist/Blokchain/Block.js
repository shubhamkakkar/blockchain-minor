"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ginore
const js_sha256_1 = require("js-sha256");
class Block {
    constructor({ data, prevHash, messageType }) {
        this.data = data;
        this.messageType = messageType;
        this.prevHash = prevHash;
        this.timeStamp = Date.now();
        this.nounce = 1;
        this.hash = this.calcHash();
    }
    calcHash() {
        return js_sha256_1.sha256(this.timeStamp + this.data + this.prevHash + this.nounce);
    }
    /*
     * we are not using the mining strategy
     * as we are validating accept and reject count which is different from the traditional blockchain
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nounce += 1;
            this.hash = this.calcHash();
        }
        return this.hash;
    }
}
exports.default = Block;

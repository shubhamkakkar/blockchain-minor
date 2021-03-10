"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfileKeys = void 0;
// @ts-ignore
const hybrid_crypto_js_1 = require("hybrid-crypto-js");
const rsa = new hybrid_crypto_js_1.RSA();
async function userProfileKeys() {
    const isError = null;
    try {
        const keys = await rsa.generateKeyPairAsync();
        return {
            ...keys,
            isError,
        };
    }
    catch (e) {
        return {
            isError,
        };
    }
}
exports.userProfileKeys = userProfileKeys;

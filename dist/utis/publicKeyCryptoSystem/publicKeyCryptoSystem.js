"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verification = exports.stringEncryption = exports.verified = void 0;
// @ts-ignore
const hybrid_crypto_js_1 = require("hybrid-crypto-js");
const crypt = new hybrid_crypto_js_1.Crypt();
const signature = ({ issuerPrivateKey, message }) => crypt.signature(issuerPrivateKey, message);
const encrypted = ({ receiverPublicKey, message, cryptoSystemSignature }) => crypt.encrypt(receiverPublicKey, message, cryptoSystemSignature);
exports.verified = ({ issuerPublicKey, cryptoSystemSignature, message, }) => crypt.verify(issuerPublicKey, cryptoSystemSignature, message);
function stringEncryption({ message, issuerPrivateKey, receiverPublicKey }) {
    const cryptoSystemSignature = signature({
        message,
        issuerPrivateKey,
    });
    return encrypted({
        receiverPublicKey,
        message,
        cryptoSystemSignature,
    });
}
exports.stringEncryption = stringEncryption;
function verification({ issuerPublicKey, receiverPrivateKey, encryptedMessage, }) {
    const { message, signature: cryptoSystemSignature, } = crypt.decrypt(receiverPrivateKey, encryptedMessage);
    const verificationBool = exports.verified({
        issuerPublicKey,
        cryptoSystemSignature,
        message,
    });
    if (verificationBool) {
        return message;
    }
    return '';
}
exports.verification = verification;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_iso_date_1 = require("graphql-iso-date");
const userResolvers_1 = __importDefault(require("./userResolvers"));
const requestBlockResolvers_1 = __importDefault(require("./requestBlockResolvers"));
const blockchainResolver_1 = __importDefault(require("./blockchainResolver"));
const customScalarResolver = {
    Date: graphql_iso_date_1.GraphQLDateTime,
};
exports.default = [
    customScalarResolver,
    userResolvers_1.default,
    requestBlockResolvers_1.default,
    blockchainResolver_1.default,
];

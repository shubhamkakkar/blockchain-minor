"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const user_1 = __importDefault(require("./user/user"));
const requestBlock_1 = __importDefault(require("./requestBlock/requestBlock"));
const blockchain_1 = __importDefault(require("./blockchain/blockchain"));
const linkSchema = apollo_server_1.gql `
  scalar Date
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;
exports.default = [linkSchema, user_1.default, requestBlock_1.default, blockchain_1.default];

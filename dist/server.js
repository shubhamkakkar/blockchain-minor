"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeDefs_1 = __importDefault(require("./typeDefs"));
const resolvers_1 = __importDefault(require("./resolvers"));
const context_1 = __importDefault(require("./context"));
function app() {
    const expressApp = express_1.default();
    expressApp.use(body_parser_1.default.json());
    const server = new apollo_server_express_1.ApolloServer({
        typeDefs: typeDefs_1.default,
        resolvers: resolvers_1.default,
        context: context_1.default,
    });
    server.applyMiddleware({ app: expressApp });
    const port = Number(process.env.PORT) || 4001;
    expressApp.listen(port, '0.0.0.0', () => {
        console.log(`Server up and running on port ${port}`);
    });
}
exports.default = app;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
function errorHandler(functionName, error) {
    console.log(`InternalServerError ${functionName} e()`, error);
    return new graphql_1.GraphQLError(`InternalServerError ${functionName} e()`);
}
exports.default = errorHandler;

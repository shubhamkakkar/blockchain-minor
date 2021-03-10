"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const mutation_1 = require("./mutation");
exports.default = {
    Query: {
        login: (parent, args) => query_1.loginUser(args),
        allUsers: (parent, args, context) => query_1.allUsers(context),
        user: (parent, args, context) => query_1.user(context),
        searchUser: (parent, args, context) => query_1.searchUser(args, context),
    },
    Mutation: {
        signUp: (parent, args, context) => mutation_1.signUpUser(args, context),
        makeUserAdmin: (parent, args, context) => mutation_1.makeUserAdmin(args, context),
    },
};

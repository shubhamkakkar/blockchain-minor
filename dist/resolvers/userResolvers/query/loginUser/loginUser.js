"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const jwt_1 = require("src/utis/jwt/jwt");
const validator_1 = __importDefault(require("src/utis/validator/validator"));
function loginUser(args) {
    const contract = new validator_1.default();
    const { email, password, } = args;
    contract.isEmail(email, 'Email is invalid');
    contract.hasMinLen(password, 6, 'password should be of at least 6 characters');
    if (!contract.isValid()) {
        return new graphql_1.GraphQLError(contract.errors() || 'Review Signup information');
    }
    return UserModel_1.default
        .findOne({ email })
        .then((user) => {
        if (user) {
            const generatedUser = user.toObject();
            const token = jwt_1.generateToken(generatedUser._id);
            return {
                ...generatedUser,
                token,
            };
        }
        return new graphql_1.GraphQLError('user does not exists');
    })
        .catch((er) => console.log('login e', er));
}
exports.default = loginUser;

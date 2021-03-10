"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const validator_1 = __importDefault(require("src/utis/validator/validator"));
const UserModel_1 = __importDefault(require("src/models/UserModel"));
const jwt_1 = require("src/utis/jwt/jwt");
const bcrypt_1 = require("src/utis/bcrypt/bcrypt");
const rsa_1 = require("src/utis/rsa/rsa");
const redis_1 = require("src/utis/redis/redis");
const errorHandler_1 = __importDefault(require("src/utis/errorHandler/errorHandler"));
function signUpUser(args, { redisClient }) {
    const contract = new validator_1.default();
    const { firstName, lastName, middleName, email, password, } = args;
    contract.isEmail(email, 'Email is invalid');
    contract.hasMinLen(password, 6, 'password should be of atleast 6 characters');
    if (!contract.isValid()) {
        return new graphql_1.GraphQLError(contract.errors() || 'Review Signup information');
    }
    return UserModel_1.default
        .findOne({ email })
        .then(async (user) => {
        if (user) {
            return new graphql_1.GraphQLError('user already exists');
        }
        const cryptPassword = await bcrypt_1.generatePasswordCrypt(password);
        const { privateKey, publicKey } = await rsa_1.userProfileKeys();
        const newUser = new UserModel_1.default({
            firstName,
            lastName,
            middleName,
            password: cryptPassword,
            publicKey,
            email,
        });
        await newUser.save();
        const generatedUser = newUser.toObject();
        redis_1.resetUsersCache(redisClient);
        return {
            ...generatedUser,
            privateKey,
            token: jwt_1.generateToken(generatedUser._id),
        };
    })
        .catch((e) => errorHandler_1.default('signUpUser', e));
}
exports.default = signUpUser;

import { TSignupArgs } from "../../../../generated/graphql";
import ValidationContract from "../../../../utis/validator/validator";
import { GraphQLError } from "graphql";
import UserModel from "../../../../models/UserModel";
import { generateToken } from "../../../../utis/jwt/jwt";

export default function signUpUser(args: TSignupArgs) {

    const contract = new ValidationContract();
    const {
        firstName,
        lastName,
        middleName,
        email,
        password,
    } = args;

    console.log({ args })
    contract.isRequired(firstName, "First Name is Required");
    contract.isRequired(lastName, "LastName is Required");
    contract.isRequired(email, "Email is Required");
    contract.isRequired(password, "password is Required");

    if (!contract.isValid()) {
        return new GraphQLError(contract.errors() || "Review Signup information")
    }

    return UserModel
        .findOne({ email })
        .then(async (user: any) => {
            if (user) {
                return new GraphQLError("user already exists")
            }

            const token = generateToken(password);
        })
        .catch(er => new GraphQLError("signun failed", er))

}
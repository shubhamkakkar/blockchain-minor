import { TSignupArgs } from "../../../../generated/graphql";
import ValidationContract from "../../../../utis/validator/validator";
import { GraphQLError } from "graphql";
import UserModel from "../../../../models/UserModel";
import { generateToken } from "../../../../utis/jwt/jwt";
import { generatePasswordCrypt } from "../../../../utis/bcrypt/bcrypt";
import { userProfileKeys } from "../../../../utis/rsa/rsa";

export default function signUpUser(args: TSignupArgs) {
    const contract = new ValidationContract();
    const {
        firstName,
        lastName,
        middleName,
        email,
        password,
    } = args;

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

            const token = generateToken({ email });
            const cyrptedPassword = await generatePasswordCrypt(password)
            const { privateKey, publicKey } = await userProfileKeys();

            const newUser = new UserModel({
                firstName,
                lastName,
                middleName,
                password: cyrptedPassword,
                publicKey,
                email,
            })

            newUser.save()

            return {
                ...newUser.toObject(),
                privateKey,
                token,
            }
            
        })
        .catch(er => new GraphQLError("signun failed", er))

}
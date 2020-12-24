import { GraphQLError } from 'graphql';

import { TSignupArgs } from 'src/generated/graphql';
import ValidationContract from 'src/utis/validator/validator';
import UserModel from 'src/models/UserModel';
import { generateToken } from 'src/utis/jwt/jwt';
import { generatePasswordCrypt } from 'src/utis/bcrypt/bcrypt';
import { userProfileKeys } from 'src/utis/rsa/rsa';

export default function signUpUser(args: TSignupArgs) {
  const contract = new ValidationContract();
  const {
    firstName,
    lastName,
    middleName,
    email,
    password,
  } = args;

  contract.isEmail(email, 'Email is invalid');
  contract.hasMinLen(password, 6, 'password should be of atleast 6 characters');

  if (!contract.isValid()) {
    return new GraphQLError(contract.errors() || 'Review Signup information');
  }

  return UserModel
    .findOne({ email })
    .then(async (user: any) => {
      if (user) {
        return new GraphQLError('user already exists');
      }

      const cryptPassword = await generatePasswordCrypt(password);
      const { privateKey, publicKey } = await userProfileKeys();

      const newUser = new UserModel({
        firstName,
        lastName,
        middleName,
        password: cryptPassword,
        publicKey,
        email,
      });
      await newUser.save();
      // eslint-disable-next-line no-underscore-dangle
      const token = generateToken({ email, userId: newUser.toObject()._id });

      return {
        ...newUser.toObject(),
        privateKey,
        token,
      };
    })
    .catch((er) => new GraphQLError('signun failed', er));
}

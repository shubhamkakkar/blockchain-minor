import { GraphQLError } from 'graphql';

import { TSignupArgs } from '../../../../generated/graphql';
import ValidationContract from '../../../../utis/validator/validator';
import UserModel from '../../../../models/UserModel';
import { generateToken, verifyInviteCode } from '../../../../utis/jwt/jwt';
import { generatePasswordCrypt } from '../../../../utis/bcrypt/bcrypt';
import { userProfileKeys } from '../../../../utis/rsa/rsa';

export default async function signUpUser(args: TSignupArgs) {
  const contract = new ValidationContract();
  const {
    firstName,
    lastName,
    middleName,
    email,
    password,
    inviteCode,
  } = args;

  contract.isEmail(email, 'Email is invalid');
  contract.isRequired(inviteCode, 'InviteCode is required');
  contract.hasMinLen(password, 6, 'password should be of atleast 6 characters');

  if (!contract.isValid()) {
    return new GraphQLError(contract.errors() || 'Review Signup information');
  }

  const verifyCode = await verifyInviteCode(inviteCode);
  if (!verifyCode) {
    return new GraphQLError('invite code is expired');
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

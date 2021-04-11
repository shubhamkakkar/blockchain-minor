import { GraphQLError } from 'graphql';

import { ReturnedUser, TLoginArgs } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';
import { comparePasswordCrypt } from 'src/utis/bcrypt/bcrypt';
import errorHandler from 'src/utis/errorHandler/errorHandler';
import { generateToken } from 'src/utis/jwt/jwt';
import ValidationContract from 'src/utis/validator/validator';

interface GeneratedUser extends ReturnedUser {
  password: string;
}

export default async function loginUser(args: TLoginArgs) {
  const contract = new ValidationContract();
  const {
    email,
    password,
  } = args;

  contract.isEmail(email, 'Email is invalid');
  contract.hasMinLen(password, 6, 'password should be of at least 6 characters');

  if (!contract.isValid()) {
    return new GraphQLError(contract.errors() || 'Review Signup information');
  }
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const generatedUser = user.toObject() as GeneratedUser;
      const isPasswordCorrect = await comparePasswordCrypt(password, generatedUser.password);
      if (isPasswordCorrect) {
        const token = generateToken(generatedUser._id);
        return {
          ...generatedUser,
          token,
        };
      }
      return new GraphQLError('Password is incorrect');
    }
    return new GraphQLError('user does not exists');
  } catch (er) {
    return errorHandler('loginUser', er);
  }
}

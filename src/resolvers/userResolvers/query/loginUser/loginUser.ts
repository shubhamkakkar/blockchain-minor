import { GraphQLError } from 'graphql';

import { ReturnedUser, TLoginArgs } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';
import { generateToken } from 'src/utis/jwt/jwt';
import ValidationContract from 'src/utis/validator/validator';

export default function loginUser(args: TLoginArgs) {
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
  return UserModel
    .findOne({ email })
    .then((user) => {
      if (user) {
        const generatedUser = user.toObject() as ReturnedUser;
        const token = generateToken(generatedUser._id);
        return {
          ...generatedUser,
          token,
        };
      }
      return new GraphQLError('user does not exists');
    })
    .catch((er) => console.log('login e', er));
}

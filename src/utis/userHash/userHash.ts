import UserModel from 'src/models/UserModel';
import { ReturnedUser } from 'src/generated/graphql';

export default function userHash(userId: string, isTokenRequired = true) {
  return UserModel.findById(userId).select(isTokenRequired ? '' : '-token').lean() as unknown as ReturnedUser;
}

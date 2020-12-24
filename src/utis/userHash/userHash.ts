import UserModel from 'src/models/UserModel';
import { ReturnedUser } from 'src/generated/graphql';

export default function userHash(userId: string) {
  return UserModel.findById(userId).lean() as unknown as ReturnedUser;
}

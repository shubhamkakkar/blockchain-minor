import UserModel from '../../models/UserModel';

export default async function userHash(userId: string) {
  const userInfo: any = {};
  if (!userInfo[userId]) {
    userInfo[userId] = await UserModel.findById(userId).lean();
  }
  return userInfo[userId];
}

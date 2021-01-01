import { GraphQLError } from 'graphql';

import UserModel from 'src/models/UserModel';

export default async function allUsers(context: any) {
  try {
    let conditions:any = {};
    if (context.user) {
      conditions = {
        _id: { $ne: context.user._id },
      };
    }

    return UserModel.find(conditions);
  } catch (e) {
    console.log('allUsers e()', e);
    throw new GraphQLError(`Internal server allUsers e() : ${e}`);
  }
}

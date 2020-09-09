import { requestDanglingBlock } from './mutation';

export default {
  Mutation: {
    requestDanglingBlock: (
      parent: any, args: any, context: any,
    ) => requestDanglingBlock(args, context),
  },
};

import { GraphQLError } from 'graphql';

const context = async ({ req }: any) => {
  try {
    await checkAuth(req);
    return req.headers;
  } catch (e) {
    console.log('context e()', e);
    throw new GraphQLError('context e()');
  }
};

export default context;

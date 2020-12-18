import { GraphQLError } from 'graphql';

const context = (reqWrapper: any) => {
  try {
    return reqWrapper.req.headers;
  } catch (e) {
    console.log('context e()', e);
    throw new GraphQLError('context e()');
  }
};

export default context;

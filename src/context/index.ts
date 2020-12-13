import { GraphQLError } from 'graphql';

const context = (reqWrapper: any) => {
  try {
    return reqWrapper.req.headers;
  } catch (e) {
    console.log('context e', e);
    throw new GraphQLError('Authentication token is not present');
  }
};

export default context;

import { GraphQLError } from 'graphql';

const context = ({ req: { headers: { authorization = '' } } }) => {
  try {
    return authorization;
  } catch (e) {
    console.log('context e', e);
    throw new GraphQLError(
      'Authentication token is invalid, please log in',
    );
  }
};

export default context;

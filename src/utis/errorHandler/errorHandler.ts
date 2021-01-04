import { GraphQLError } from 'graphql';

export default function errorHandler(functionName: string, error: any) {
  console.log(`InternalServerError ${functionName} e()`, error);
  return new GraphQLError(`InternalServerError ${functionName} e()`);
}

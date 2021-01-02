import express from 'express';
import { RedisClient } from 'redis';

import { verifyToken } from 'src/utis/jwt/jwt';
import { ReturnedUser } from 'src/generated/graphql';

interface IRequest extends express.Request {
  user?: ReturnedUser
}

export type Context = {
  req: IRequest,
  client: RedisClient
}

async function checkAuth(req: IRequest) {
  const token = req.headers.authorization;
  if (token) {
    const tokenContent = await verifyToken(token);
    if (tokenContent?.user) {
      req.user = tokenContent.user;
    }
  }
}

async function context({ req, client }: { req: IRequest, client: RedisClient}): Promise<Context> {
  try {
    await checkAuth(req);
    return { req, client };
  } catch (e) {
    console.log('context e()', e);
    throw new Error('context e()');
  }
}

export default context;

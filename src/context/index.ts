import express from 'express';
import { RedisClient } from 'redis';

import { verifyToken } from 'src/utis/jwt/jwt';
import { ReturnedUser } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';

interface IRequest extends express.Request {
  user?: ReturnedUser
}

export type Context = {
  req: IRequest,
  redisClient: RedisClient
}

async function checkAuth(req: IRequest, client: RedisClient) {
  const token = req.headers.authorization;
  if (token) {
    const { id: userId } = await verifyToken(token);
    if (userId) {
      client.get(userId, async (err, cachedUser) => {
        if (cachedUser) {
          req.user = JSON.parse(cachedUser);
        } else {
          const user = await UserModel.findById(userId).select('-password');
          if (user) {
            const objectifiedUser = user.toObject();
            client.set(userId, JSON.stringify(objectifiedUser));
            req.user = objectifiedUser;
          }
        }
      });
    }
  }
}

async function context({ req, client }: { req: IRequest, client: RedisClient}): Promise<Context> {
  try {
    await checkAuth(req, client);
    return { req, redisClient: client };
  } catch (e) {
    console.log('context e()', e);
    throw new Error('context e()');
  }
}

export default context;

import { promisify } from 'util';

import express from 'express';
import redis, { RedisClient } from 'redis';

import { verifyToken } from 'src/utis/jwt/jwt';
import { ReturnedUser } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';
import { REDIS_DB } from 'src/constants';

interface IRequest extends express.Request {
  user?: ReturnedUser
}

export type Context = {
  req: {
    user?: ReturnedUser
  },
  redisClient: RedisClient,
  customRedisGet: (key: string) => Promise<any>,
}

const client = redis.createClient({
  host: REDIS_DB.REDIS_DB_HOST,
  port: Number(REDIS_DB.REDIS_DB_PORT),
});

const customRedisGet = async (key: string) => {
  const redisCache = await promisify(client.get).bind(client)(key) as string;
  if (redisCache) {
    return JSON.parse(redisCache);
  }
  return null;
};

async function checkAuth(req: IRequest) {
  const token = req.headers.authorization;
  let user: ReturnedUser | undefined;

  if (token) {
    const { id: userId } = await verifyToken(token);
    if (userId) {
      const dbUser = await UserModel.findById(userId).select('-password');
      if (dbUser) {
        user = dbUser.toObject();
      }
    }
  }
  return user;
}

async function context({ req }: { req: IRequest}): Promise<Context> {
  try {
    return {
      req: { user: await checkAuth(req) }, redisClient: client, customRedisGet,
    };
  } catch (e) {
    console.log('context e()', e);
    throw new Error('context e()');
  }
}

export default context;

import { promisify } from 'util';

import express from 'express';
import redis, { RedisClient } from 'redis';
import dotenv from 'dotenv';

import { verifyToken } from 'src/utis/jwt/jwt';
import { ReturnedUser } from 'src/generated/graphql';
import UserModel from 'src/models/UserModel';

interface IRequest extends express.Request {
  user?: ReturnedUser
}

export type Context = {
  req: {
    user?: ReturnedUser
  },
  redisClient: RedisClient,
  customRedisGet: (key: string) => Promise<any>
}

dotenv.config();

const client = redis.createClient({
  host: process.env.REDIS_DB_HOST,
  port: Number(process.env.REDIS_DB_PORT),
});

const customRedisGet = async (key: string) => {
  const redisCache = await promisify(client.get).bind(client)(key) as string;
  if (redisCache) {
    return JSON.parse(redisCache);
  }
  return null;
};
// @ts-ignore
// client.get = customRedisGet;
async function checkAuth(req: IRequest) {
  const token = req.headers.authorization;
  let user: ReturnedUser | undefined;
  if (token) {
    const { id: userId } = await verifyToken(token);
    if (userId) {
      user = await customRedisGet(userId);
      // @ts-ignore
      if (!user?._id) {
        const dbUser = await UserModel.findById(userId).select('-password');
        if (dbUser) {
          // console.log('dbUser', dbUser);
          const objectifiedUser = dbUser.toObject();
          client.set(userId, JSON.stringify(objectifiedUser));
          user = dbUser.toObject();
        }
      }
    }
  }
  return user;
}

async function context({ req }: { req: IRequest}): Promise<Context> {
  try {
    return { req: { user: await checkAuth(req) }, redisClient: client, customRedisGet };
  } catch (e) {
    console.log('context e()', e);
    throw new Error('context e()');
  }
}

export default context;

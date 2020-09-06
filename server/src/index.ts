import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { COOKIE_NAME } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import path from 'path';
import { Updoot } from './entities/Updoot';
//2
const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'ruster',
    username: 'postgres',
    password: 'roast',
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
    migrations: [path.join(__dirname, './migrations/*')],
  });
  await conn.runMigrations();

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.set('trust proxy', 1);
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        port: 6379,
        host: 'localhost',
      }),
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
      secret: 'ddwadwadwafsefseerw',
      resave: false,
      rolling: true,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });
  app.listen(4000, () => {
    console.log('server  is runnig on 4000 ');
  });
};
main().catch((error) => {
  console.log(3);
  console.error(error);
});

import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';
export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: 'reddit',
  entities: [Post, User],
  debug: !__prod__,
  user: 'postgres',
  password: 'roast',
  host: 'localhost',
  port: 5432,
  type: 'postgresql',
} as Parameters<typeof MikroORM.init>[0];

import { MyContext } from 'src/types';
import { MiddlewareFn } from 'type-graphql';

export const authCheck: MiddlewareFn<MyContext> = ({ context }, next) => {
  console.log(context);
  console.log(context.req.session.userId);
  if (!context.req.session.userId) {
    throw new Error('not authenticated');
  }
  return next();
};

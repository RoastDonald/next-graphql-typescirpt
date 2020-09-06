import { Updoot } from '../entities/Updoot';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { PostDto } from '../DTO/PostDto';
import { Post } from '../entities/Post';
import { authCheck } from '../middlewares/authCheck';
import { MyContext } from '../types';

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authCheck)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) _value: number,
    @Ctx() { req }: MyContext
  ) {
    const userId = req.session.userId;
    const isVoteExists = await Updoot.findOne({ where: { postId, userId } });
    const isUpdoot = _value !== -1;
    const value = isUpdoot ? 1 : -1;

    if (isVoteExists && isVoteExists.value !== _value) {
      await getConnection().transaction(async (tm) => {
        console.log('here:', value);
        await tm.query(
          `
          update updoot
          set value = $1
          where "postId" = $2 and "userId" = $3
        `,
          [value, postId, userId]
        );

        await tm.query(
          `
          update post 
          set points = points + $1
          where id = $2
        `,
          [2 * value, postId]
        );
      });
    } else if (!isVoteExists) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into updoot("userId","postId",value)
          values ($1,$2,$3)
        `,
          [userId, postId, value]
        );

        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [value, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('limit', () => Int) limit: number,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const _limit = Math.min(50, limit);
    const _limitPlusOne = _limit + 1;

    const params: any[] = [_limitPlusOne];

    if (req.session.userId) {
      params.push(req.session.userId);
    }

    let userIdx = 3;
    if (cursor) {
      params.push(new Date(parseInt(cursor, 10)));
      userIdx = params.length;
    }

    const posts = await getConnection().query(
      `
    select p.*,
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email
      ) author ,
    ${
      req.session.userId
        ? `(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"`
        : `null as "voteStatus"`
    }
    from post p
    inner join public.user u on u.id = p."authorId"
    ${cursor ? `where p."createdAt" < $${userIdx}` : ''}
    order by p."createdAt" DESC
    limit $1
    `,
      params
    );
    return {
      posts: posts.slice(0, _limit),
      hasMore: posts.length === _limitPlusOne,
    };
  }
  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id, { relations: ['author'] });
  }

  @Mutation(() => Post)
  @UseMiddleware(authCheck)
  async createPost(
    @Arg('body') body: PostDto,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({
      ...body,
      authorId: req.session.userId,
    }).save();
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(authCheck)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('title') title: string,
    @Arg('text') text: string,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const post = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "authorId" = :authorId', {
        id,
        authorId: req.session.userId,
      })
      .returning('*')
      .execute();
    return post.raw[0];
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authCheck)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    console.log(id, req.session.userId);
    await Post.delete({
      id,
      authorId: parseInt(req.session.userId),
    });
    return true;
  }
}

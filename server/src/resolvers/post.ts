import { PostDto } from '../DTO/PostDto';
import { authCheck } from '../middlewares/authCheck';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';
import { getConnection } from 'typeorm';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Arg('limit', () => Int) limit: number
  ): Promise<Post[]> {
    const _limit = Math.min(50, limit);
    const posts = getConnection()
      .getRepository(Post)
      .createQueryBuilder('p')
      .orderBy('"createdAt"', 'DESC')
      .take(_limit);
    if (cursor) {
      posts.where('"createdAt" < :cursor', {
        cursor: new Date(parseInt(cursor)),
      });
    }
    return posts.getMany();
  }
  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
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
    @Arg('id') id: number,
    @Arg('title', () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) return null;
    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(authCheck)
  async deletePost(@Arg('id') id: number): Promise<Boolean> {
    await Post.delete(id);
    return true;
  }
}

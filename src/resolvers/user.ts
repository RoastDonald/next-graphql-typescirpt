import { MyContext } from 'src/types';
import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import { User } from '../entities/User';

@InputType()
class UserDAO {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FiledError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FiledError], { nullable: true })
  errors?: FiledError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async signUp(
    @Arg('body') { password, username }: UserDAO,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (username.length <= 4) {
      return {
        errors: [
          {
            field: 'username',
            message: 'username should be greater than 4',
          },
        ],
      };
    }

    if (password.length <= 4) {
      return {
        errors: [
          {
            field: 'password',
            message: 'password should be greater than 4',
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username has already been taken',
            },
          ],
        };
      }
    }
    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async signIn(
    @Arg('body') { username, password }: UserDAO,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOneOrFail(User, { username });
    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'incorrect id',
          },
        ],
      };
    }
    const isValid = await argon2.verify(user.password, password);
    if (!isValid)
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect password',
          },
        ],
      };
    return {
      user,
    };
  }
}

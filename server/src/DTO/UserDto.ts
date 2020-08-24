import { Field, InputType } from 'type-graphql';

@InputType()
export class UserDto {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
}

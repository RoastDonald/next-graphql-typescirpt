import { Field, InputType } from 'type-graphql';

@InputType()
export class PostDto {
  @Field()
  title: string;

  @Field()
  text: string;
}

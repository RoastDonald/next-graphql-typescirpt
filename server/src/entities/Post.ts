import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';
import { User } from './User';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  authorId: number;

  @Field()
  @Column()
  text!: string;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null;

  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];

  @Field()
  @Column({ type: 'int', default: 0 })
  points!: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Field()
  @Column()
  title!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @CreateDateColumn()
  updatedAt: Date;
}

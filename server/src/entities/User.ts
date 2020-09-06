import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Entity,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Post } from './Post';
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  email!: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

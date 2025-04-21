import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Index,
} from "typeorm";
import { Post } from "./Post";

@Entity()
@Index(["tag"], { unique: true })
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag: string;

  @ManyToMany(() => Post, post => post.hashtags)
  posts: Post[];
}

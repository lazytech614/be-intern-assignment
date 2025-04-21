import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { Users } from "./User";
import { Post } from "./Post";

@Entity()
export class Like {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Users, user => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user: Users;

  @ManyToOne(() => Post, post => post.likes)
  @JoinColumn({ name: "postId" })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}

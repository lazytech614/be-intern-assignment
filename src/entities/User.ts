import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index
} from "typeorm";
import { Post } from "./Post";
import { Follow } from "./Follow";
import { Like } from "./Like";
import { Activity } from "./Activity";

@Entity()
@Index(["username"], { unique: true })
@Index(["email"], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  // self‑referencing many‑to‑many for follows
  @ManyToMany(() => User, user => user.followers)
  @JoinTable({ name: "follow" })
  followings: User[];

  @ManyToMany(() => User, user => user.followings)
  followers: User[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Activity, activity => activity.user)
  activities: Activity[];
}

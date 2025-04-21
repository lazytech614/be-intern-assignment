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
// import { Follow } from "./Follow";
import { Like } from "./Like";
import { Activity } from "./Activity";

@Entity()
@Index(["email"], { unique: true })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @ManyToMany(() => Users, user => user.followers)
  @JoinTable({ name: "follow" }) // Owning side
  followings: Users[];

  @ManyToMany(() => Users, user => user.followings)
  followers: Users[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Activity, activity => activity.user)
  activities: Activity[];
}

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
@Index(["email"], { unique: true })  // only email is unique/indexed now :contentReference[oaicite:0]{index=0}
export class Users {
  @PrimaryGeneratedColumn()
  id: number;                         // auto‑increment PK :contentReference[oaicite:1]{index=1}

  @Column()
  firstName: string;                  // new firstName column :contentReference[oaicite:2]{index=2}

  @Column()
  lastName: string;                   // new lastName column :contentReference[oaicite:3]{index=3}

  @Column()
  email: string;                      // still unique/indexed :contentReference[oaicite:4]{index=4}

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @ManyToMany(() => Users, user => user.followers)
  @JoinTable({ name: "follow" })
  followings: Users[];

  @ManyToMany(() => Users, user => user.followings)
  followers: Users[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Activity, activity => activity.user)
  activities: Activity[];
}

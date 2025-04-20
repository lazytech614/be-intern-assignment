import {
    Entity,
    PrimaryColumn,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User";
  import { Post } from "./Post";
  
  @Entity()
  export class Like {
    @PrimaryColumn()
    userId: number;
  
    @PrimaryColumn()
    postId: number;
  
    @ManyToOne(() => User, user => user.likes)
    @JoinColumn({ name: "userId" })
    user: User;
  
    @ManyToOne(() => Post, post => post.likes)
    @JoinColumn({ name: "postId" })
    post: Post;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
import {
    Entity,
    ManyToOne,
    PrimaryColumn,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { User } from "./User";
  
  @Entity()
  export class Follow {
    // 1) Mark the join column as a primary column
    @PrimaryColumn({ name: "followerId", type: "uuid" })
    @ManyToOne(() => User, (user) => user.followings)
    @JoinColumn({ name: "followerId" })
    follower: User;
  
    @PrimaryColumn({ name: "followingId", type: "uuid" })
    @ManyToOne(() => User, (user) => user.followers)
    @JoinColumn({ name: "followingId" })
    following: User;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
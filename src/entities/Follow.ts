import {
    Entity,
    ManyToOne,
    PrimaryColumn,
    CreateDateColumn,
    JoinColumn,
  } from "typeorm";
  import { Users } from "./User";
  
  @Entity()
  export class Follow {
    // 1) Mark the join column as a primary column
    @PrimaryColumn({ name: "followerId", type: "uuid" })
    @ManyToOne(() => Users, (user) => user.followings)
    @JoinColumn({ name: "followerId" })
    follower: Users;
  
    @PrimaryColumn({ name: "followingId", type: "uuid" })
    @ManyToOne(() => Users, (user) => user.followers)
    @JoinColumn({ name: "followingId" })
    following: Users;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
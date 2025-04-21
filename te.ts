// import {
//   Entity,
//   ManyToOne,
//   PrimaryColumn,
//   CreateDateColumn,
//   JoinColumn,
// } from "typeorm";
// import { Users } from "./User";

// @Entity()
// export class Follow {
//   @PrimaryColumn()
//   followerId: number;

//   @PrimaryColumn()
//   followingId: number;

//   @ManyToOne(() => Users, user => user.followings)
//   @JoinColumn({ name: "followerId" })
//   follower: Users;

//   @ManyToOne(() => Users, user => user.followers)
//   @JoinColumn({ name: "followingId" })
//   following: Users;

//   @CreateDateColumn()
//   createdAt: Date;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Users } from "./User";

export enum ActivityType {
  POST_CREATED = "POST_CREATED",
  LIKED = "LIKED",
  FOLLOWED = "FOLLOWED",
  UNFOLLOWED = "UNFOLLOWED",
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => Users, user => user.activities)
  @JoinColumn({ name: "userId" })
  user: Users;

  @Column({ type: "varchar" }) // make sure enum stored as string
  type: ActivityType;

  @Column()
  referenceId: number;

  @CreateDateColumn()
  createdAt: Date;
}

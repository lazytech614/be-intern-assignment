import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from "typeorm";
import { Users } from "./User";
import { Post } from "./Post";

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

  @ManyToOne(() => Users, user => user.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user: Users;

  @Column({ type: "varchar" })
  type: ActivityType;

  @Column()
  referenceId: number;

  @ManyToOne(() => Post, post => post.likes, { nullable: true })
  @JoinColumn({ name: "referenceId", referencedColumnName: "id" })
  post: Post; // Reference to Post when activity is of type POST_CREATED

  @CreateDateColumn()
  createdAt: Date;
}

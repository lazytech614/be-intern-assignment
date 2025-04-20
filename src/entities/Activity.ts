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
    LIKED        = "LIKED",
    FOLLOWED     = "FOLLOWED",
    UNFOLLOWED   = "UNFOLLOWED",
  }
  
  @Entity()
  export class Activity {
    @PrimaryGeneratedColumn()
    id: number;
  
    // Explicit foreign key column
    @Column()
    userId: number;
  
    // Restored relation back to User
    @ManyToOne(() => Users, user => user.activities)
    @JoinColumn({ name: "userId" })
    user: Users;
  
    // Store enum as a plain string (SQLite has no ENUM)
    @Column()
    type: ActivityType;
  
    @Column()
    referenceId: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
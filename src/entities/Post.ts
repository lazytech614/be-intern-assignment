import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    Index
  } from "typeorm";
  import { User } from "./User";
  import { Hashtag } from "./Hashtag";
  import { Like } from "./Like";
  
  @Entity()
  @Index(["author", "createdAt"])
  export class Post {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, user => user.posts)
    author: User;
  
    @Column("text")
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToMany(() => Hashtag, tag => tag.posts, { cascade: true })
    @JoinTable({ name: "post_hashtag" })
    hashtags: Hashtag[];
  
    @OneToMany(() => Like, like => like.post)
    likes: Like[];
  }
  
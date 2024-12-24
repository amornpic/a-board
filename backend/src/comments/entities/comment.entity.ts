
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Comment {
@PrimaryGeneratedColumn()
  id: number;

  @Column()
  massage: string;

  @ManyToOne(() => Post, (user) => user.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

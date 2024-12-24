import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const user = await this.usersService.findOne(createCommentDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.postsService.findOne(createCommentDto.post_id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = new Comment();
    comment.massage = createCommentDto.massage;
    comment.post = post;
    comment.user = user;

    return await this.commentsRepository.save(comment);
  }

  findAll() {
    return this.commentsRepository.find({
      relations: ['user'],
    });
  }
}

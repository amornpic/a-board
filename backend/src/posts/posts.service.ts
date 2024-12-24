import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const user = await this.usersService.findOne(createPostDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = new Post();
    post.title = createPostDto.title;
    post.community = createPostDto.community;
    post.body = createPostDto.body;
    post.user = user;

    return await this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    if (post.user.id !== updatePostDto.user_id) {
      throw new UnauthorizedException('You can only update your own posts');
    }

    Object.assign(post, updatePostDto);

    return this.postsRepository.save(post);
  }

  async remove(id: number, user_id: number): Promise<void> {
    const post = await this.findOne(id);

    if (post.user.id !== user_id) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    await this.postsRepository.delete(id);
  }
}

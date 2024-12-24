import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { HttpException, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let postsService: PostsService;
  let postRepository: Repository<Post>;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  let commentRepository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            save: jest.fn().mockResolvedValue(new Comment()),
            find: jest.fn().mockResolvedValue([new Comment(), new Comment()]),
            findOne: jest.fn().mockResolvedValue(new Comment()),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: PostsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(new Post()),
          },
        },
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findOne: jest.fn().mockResolvedValue(new Post()),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(new User()),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(new User()),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto: CreateCommentDto = {
        massage: 'This is a test comment',
        post_id: 1,
        user_id: 1,
      };

      const result = await service.create(createCommentDto);

      expect(result).toBeDefined();
      expect(commentRepository.save).toHaveBeenCalledTimes(1);
      expect(commentRepository.save).toHaveBeenCalledWith(expect.any(Comment));
    });

    it('should throw an error if post is not found', async () => {
      const createCommentDto: CreateCommentDto = {
        massage: 'This is a test comment',
        post_id: 1,
        user_id: 1,
      };

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      try {
        await service.create(createCommentDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Post not found');
      }
    });

    it('should throw an error if user is not found', async () => {
      const createCommentDto: CreateCommentDto = {
        massage: 'This is a test comment',
        post_id: 1,
        user_id: 1,
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      try {
        await service.create(createCommentDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('User not found');
      }
    });
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const result = await service.findAll();

      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
      expect(commentRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});

     
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.username = 'test';

  const mockPost = new Post();
  mockPost.title = 'Test Post';
  mockPost.body = 'This is a test post';
  mockPost.user = mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            save: jest.fn().mockResolvedValue(mockPost),
            find: jest.fn().mockResolvedValue([mockPost]),
            findOne: jest.fn().mockResolvedValue(mockPost),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a new post', async () => {
    const newPost = new CreatePostDto();
    newPost.title = mockPost.title;
    newPost.body = mockPost.body;
    newPost.user_id = mockPost.user.id;

    const result = await service.create(newPost);
    
    expect(postRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPost);
  });

  it('should throw an error if post is not provided', async () => {
    try {
      await service.create(null);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should throw an error if user is not found', async () => {
    const post = new CreatePostDto();
    post.title = 'Test Post';
    post.body = 'This is a test post';

    try {
      await service.create(post);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

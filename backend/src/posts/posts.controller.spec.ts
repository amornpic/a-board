import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockUser = new User();
  mockUser.id = 1;
  mockUser.username = 'test';

  const mockPost = new Post();
  mockPost.title = 'Test Post';
  mockPost.body = 'This is a test post';
  mockPost.community = 'Test community';
  mockPost.user = mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost),
            findAll: jest.fn().mockResolvedValue([mockPost]),
            findOne: jest.fn().mockResolvedValue(mockPost),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto = new CreatePostDto()
      createPostDto.title = 'Test Post';
      createPostDto.body = 'This is a test post';
      createPostDto.community = 'Test community';
      createPostDto.user_id = 1;

      const result = await controller.create(createPostDto);
      
      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const id = 1;
      const result = await controller.findOne(id.toString());
      expect(result).toBeDefined();
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const id = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
        body: 'This is an updated post',
      };

      const result = await controller.update(id.toString(), updatePostDto);
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(id, updatePostDto);
    });
  });

  describe('remove', () => {
    it('should delete a post', async () => {
      const id = 1;
      await controller.remove(id.toString(), mockUser.id);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(id, mockUser.id);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [        {
        provide: CommentsService,
        useValue: {
          create: jest.fn().mockResolvedValue(new Comment()),
          findAll: jest.fn().mockResolvedValue([new Comment(), new Comment()]),
        },
      },],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const comment = new CreateCommentDto()
      comment.massage = 'Test comment';
      comment.post_id = 7;
      comment.user_id = 1;

      const result = await controller.create(comment);
      
      expect(result).toBeDefined();
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(comment);
    });
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
});

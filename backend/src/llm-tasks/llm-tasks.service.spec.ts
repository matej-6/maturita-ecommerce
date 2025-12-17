import { Test, TestingModule } from '@nestjs/testing';
import { LlmTasksService } from './llm-tasks.service';

describe('LlmTasksService', () => {
  let service: LlmTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmTasksService],
    }).compile();

    service = module.get<LlmTasksService>(LlmTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

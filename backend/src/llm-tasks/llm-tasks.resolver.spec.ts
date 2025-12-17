import { Test, TestingModule } from '@nestjs/testing';
import { LlmTasksResolver } from './llm-tasks.resolver';
import { LlmTasksService } from './llm-tasks.service';

describe('LlmTasksResolver', () => {
  let resolver: LlmTasksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmTasksResolver, LlmTasksService],
    }).compile();

    resolver = module.get<LlmTasksResolver>(LlmTasksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

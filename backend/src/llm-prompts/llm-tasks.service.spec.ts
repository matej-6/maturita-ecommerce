import { Test, TestingModule } from '@nestjs/testing';
import { LLMPromptsService } from './llm-prompts.service';

describe('LlmTasksService', () => {
  let service: LLMPromptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LLMPromptsService],
    }).compile();

    service = module.get<LLMPromptsService>(LLMPromptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LocalesResolver } from './locales.resolver';
import { LocalesService } from './locales.service';

describe('LocalesResolver', () => {
  let resolver: LocalesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalesResolver, LocalesService],
    }).compile();

    resolver = module.get<LocalesResolver>(LocalesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

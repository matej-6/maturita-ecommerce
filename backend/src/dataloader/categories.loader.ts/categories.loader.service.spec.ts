import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesLoaderTsService } from './categories.loader.service';

describe('CategoriesLoaderTsService', () => {
  let service: CategoriesLoaderTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesLoaderTsService],
    }).compile();

    service = module.get<CategoriesLoaderTsService>(CategoriesLoaderTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantsResolver } from './product-variants.resolver';
import { ProductVariantsService } from './product-variants.service';

describe('ProductVariantsResolver', () => {
  let resolver: ProductVariantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantsResolver, ProductVariantsService],
    }).compile();

    resolver = module.get<ProductVariantsResolver>(ProductVariantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

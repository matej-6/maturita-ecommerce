import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantAttributeKeysResolver } from './product-variant-attribute-keys.resolver';
import { ProductVariantAttributeKeysService } from './product-variant-attribute-keys.service';

describe('ProductVariantAttributeKeysResolver', () => {
  let resolver: ProductVariantAttributeKeysResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantAttributeKeysResolver, ProductVariantAttributeKeysService],
    }).compile();

    resolver = module.get<ProductVariantAttributeKeysResolver>(ProductVariantAttributeKeysResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

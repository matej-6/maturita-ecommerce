import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantAttributesResolver } from './product-variant-attributes.resolver';
import { ProductVariantAttributesService } from './product-variant-attributes.service';

describe('ProductVariantAttributesResolver', () => {
  let resolver: ProductVariantAttributesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantAttributesResolver, ProductVariantAttributesService],
    }).compile();

    resolver = module.get<ProductVariantAttributesResolver>(ProductVariantAttributesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

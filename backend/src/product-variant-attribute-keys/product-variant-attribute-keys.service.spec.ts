import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantAttributeKeysService } from './product-variant-attribute-keys.service';

describe('ProductVariantAttributeKeysService', () => {
  let service: ProductVariantAttributeKeysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantAttributeKeysService],
    }).compile();

    service = module.get<ProductVariantAttributeKeysService>(ProductVariantAttributeKeysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

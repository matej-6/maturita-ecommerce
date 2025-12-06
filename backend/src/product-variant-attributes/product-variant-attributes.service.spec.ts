import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariantAttributesService } from './product-variant-attributes.service';

describe('ProductVariantAttributesService', () => {
  let service: ProductVariantAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductVariantAttributesService],
    }).compile();

    service = module.get<ProductVariantAttributesService>(ProductVariantAttributesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

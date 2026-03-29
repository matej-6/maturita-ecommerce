import {
  Attribute,
  AttributeKey,
  AttributeKeyTranslation,
  AttributeTranslation,
  Category,
  CategoryTranslation,
  ProductImage,
  ProductTranslation,
  ProductVariant,
  ProductVariantImage,
} from 'generated/prisma/client';
import DataLoader from 'dataloader';
import { Product } from 'src/products/entities/product.entity';
import { ProductReview } from 'src/product-reviews/entities/productReview.entity';
import { ProductReviewAuthor } from 'src/product-reviews/entities/productReviewAuthor.entity';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<number, Category[]>;
  categoryTranslationLoader: DataLoader<number, CategoryTranslation | null>;
  categoryProductsCountLoader: DataLoader<number, number>;
  productAllImagesLoader: DataLoader<number, ProductImage[]>;
  productTranslationLoader: DataLoader<number, ProductTranslation | null>;
  productAllTranslationsLoader: DataLoader<number, ProductTranslation[]>;
  productAllVariantsLoader: DataLoader<number, ProductVariant[]>;
  productVariantAllAttributesLoader: DataLoader<number, Attribute[]>;
  productVariantAttributeTranslationLoader: DataLoader<
    number,
    AttributeTranslation | null
  >;
  productVariantAttributeAllTranslationsLoader: DataLoader<
    number,
    AttributeTranslation[]
  >;
  productVariantAllImagesLoader: DataLoader<number, ProductVariantImage[]>;
  attributeKeyByIdLoader: DataLoader<number, AttributeKey | null>;
  attributeKeyTranslationLoader: DataLoader<
    number,
    AttributeKeyTranslation | null
  >;
  attributeKeyAllTranslationsLoader: DataLoader<
    number,
    AttributeKeyTranslation[]
  >;
  attributesByKeyLoader: DataLoader<number, Attribute[]>;
  productVariantProductLoader: DataLoader<number, Product>;
  cartItemProductVariantLoader: DataLoader<number, ProductVariant | null>;
  orderItemProductVariantLoader: DataLoader<number, ProductVariant | null>;
  productVariantsByAttributeIdLoader: DataLoader<number, ProductVariant[]>;
  orderItemProductReviewLoader: DataLoader<number, ProductReview | null>;
  productReviewAuthorLoader: DataLoader<number, ProductReviewAuthor | null>;
  productVariantByProductReviewIdLoader: DataLoader<
    number,
    ProductVariant | null
  >;
}

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
} from 'generated/prisma/client';
import DataLoader from 'dataloader';
import { Product } from 'src/products/entities/product.entity';

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
  productVariantAllImagesLoader: DataLoader<number, ProductImage[]>;
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
}

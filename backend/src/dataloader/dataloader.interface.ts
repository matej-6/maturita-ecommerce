import {
  Attribute,
  AttributeKey,
  AttributeKeyTranslation,
  AttributeTranslation,
  Category,
  CategoryTranslation,
  ProductTranslation,
  ProductVariant,
} from 'generated/prisma/client';
import DataLoader from 'dataloader';

export interface IDataLoaders {
  subcategoriesLoader: DataLoader<number, Category[]>;
  categoryTranslationLoader: DataLoader<number, CategoryTranslation | null>;
  categoryProductsCountLoader: DataLoader<number, number>;
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
  attributeKeyByIdLoader: DataLoader<number, AttributeKey | null>;
  attributeKeyTranslationLoader: DataLoader<
    number,
    AttributeKeyTranslation | null
  >;
  attributeKeyAllTranslationsLoader: DataLoader<
    number,
    AttributeKeyTranslation[]
  >;
}

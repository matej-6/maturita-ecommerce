import {
  Attribute,
  AttributeKey,
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
  attributeKeyByIdLoader: DataLoader<number, AttributeKey | null>;
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { LocalesService } from 'src/locales/locales.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductVariantAttributeKeysService } from 'src/product-variant-attribute-keys/product-variant-attribute-keys.service';
import { ProductVariantAttributesService } from 'src/product-variant-attributes/product-variant-attributes.service';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';
import * as fs from 'fs';
import { ProductVariantsService } from 'src/product-variants/product-variants.service';
import { QdrantService } from 'src/qdrant/qdrant.service';
import { LLMPromptsService } from 'src/llm-prompts/llm-prompts.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
    private readonly userService: UsersService,
    private readonly categoriesService: CategoriesService,
    private readonly attributesService: ProductVariantAttributesService,
    private readonly attributeKeysService: ProductVariantAttributeKeysService,
    private readonly localesService: LocalesService,
    private readonly productVariantsService: ProductVariantsService,
    private readonly qdrantService: QdrantService,
    private readonly llmService: LLMPromptsService,
    @InjectQueue('llm-tasks') private readonly llmTasksQueue: Queue,
  ) {}

  onModuleInit() {
    this.logger.log('Seeding started...');
  }

  private async clearDatabase() {
    this.logger.log('Clearing database...');
    await this.prismaService.attribute.deleteMany();
    await this.prismaService.attributeKey.deleteMany();
    await this.prismaService.lLMTask.deleteMany();
    await this.prismaService.productVariant.deleteMany();
    await this.prismaService.product.deleteMany();
    await this.prismaService.category.deleteMany();
    await this.prismaService.user.deleteMany();
    await this.llmService.clearLlmTasksQueue();
    await this.qdrantService.clearProductCollections();
    this.logger.log('Database cleared.');
  }

  private async seedUsers() {
    this.logger.log('Seeding users...');
    const users = [
      {
        email: 'email@admin.com',
        password: '123456789',
        confirmPassword: '123456789',
        name: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
      },
      {
        email: 'email@user.com',
        password: '123456789',
        confirmPassword: '123456789',
        name: 'Regular',
        lastName: 'User',
        role: 'USER',
      },
    ];

    for (const userData of users) {
      this.logger.log(`Seeding user: ${userData.email}`);
      const createdUser = await this.userService.create({
        ...userData,
      });
      if (userData.role === 'ADMIN') {
        await this.prismaService.user.update({
          where: { id: createdUser.id },
          data: { role: 'ADMIN' },
        });
      }
    }
    this.logger.log('Users seeded.');
  }

  async seed() {
    await this.clearDatabase();
    await this.seedUsers();
    this.logger.log('Seeding attribute keys...');
    const colorKey = await this.attributeKeysService.create({
      key: 'color',
    });

    await this.attributeKeysService.createTranslation({
      keyId: colorKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'colour',
    });

    await this.attributeKeysService.createTranslation({
      keyId: colorKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'farba',
    });

    const weightKey = await this.attributeKeysService.create({
      key: 'weight',
    });

    await this.attributeKeysService.createTranslation({
      keyId: weightKey.id,
      localeCode: this.localesService.locales().english.code,
      keyTranslation: 'weight',
    });

    await this.attributeKeysService.createTranslation({
      keyId: weightKey.id,
      localeCode: this.localesService.locales().slovak.code,
      keyTranslation: 'hmotnosť',
    });

    this.logger.log('Attribute keys seeded.');

    this.logger.log('Seeding categories...');
    const regenerationCategory = await this.categoriesService.create({
      slug: 'regeneration',
    });

    await this.categoriesService.createTranslation(regenerationCategory.id, {
      categoryId: regenerationCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Regeneration',
      description: 'Supplements that help with regeneration.',
    });

    await this.categoriesService.createTranslation(regenerationCategory.id, {
      categoryId: regenerationCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Regenerácia',
      description: 'Doplnky, ktoré pomáhajú s regeneráciou.',
    });

    const creatineCategory = await this.categoriesService.create({
      slug: 'creatine',
      parentCategoryId: regenerationCategory.id,
    });

    await this.categoriesService.createTranslation(creatineCategory.id, {
      categoryId: creatineCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Creatine',
      description: 'Creatine supplements for muscle growth and performance.',
    });

    await this.categoriesService.createTranslation(creatineCategory.id, {
      categoryId: creatineCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Kreatín',
      description: 'Kreatínové doplnky pre rast svalov a výkon.',
    });

    const proteinCategory = await this.categoriesService.create({
      slug: 'protein',
      parentCategoryId: regenerationCategory.id,
    });

    await this.categoriesService.createTranslation(proteinCategory.id, {
      categoryId: proteinCategory.id,
      localeCode: this.localesService.locales().english.code,
      name: 'Protein',
      description: 'Protein supplements for muscle building and recovery.',
    });

    await this.categoriesService.createTranslation(proteinCategory.id, {
      categoryId: proteinCategory.id,
      localeCode: this.localesService.locales().slovak.code,
      name: 'Proteín',
      description: 'Proteínové doplnky pre budovanie svalov a regeneráciu.',
    });

    this.logger.log('Categories seeded.');

    this.logger.log('Seeding products...');
    const creatineMonohydrate = await this.productsService.create({
      slug: 'creatine-monohydrate',
      categoryId: creatineCategory.id,
      isPublic: true,
    });

    await this.productsService.createProductTranslation(
      creatineMonohydrate.id,
      {
        localeCode: this.localesService.locales().english.code,
        name: 'Creatine Monohydrate',
        description: 'Most popular form of creatine supplement.',
        markdownContent: fs.readFileSync(
          __dirname +
            '/../../prisma/seed/data/content/creatine-monohydrate.en.md',
          'utf-8',
        ),
      },
    );

    await this.productsService.createProductTranslation(
      creatineMonohydrate.id,
      {
        localeCode: this.localesService.locales().slovak.code,
        name: 'Kreatín Monohydrát',
        description: 'Najpopulárnejšia forma kreatínového doplnku.',
        markdownContent: fs.readFileSync(
          __dirname +
            '/../../prisma/seed/data/content/creatine-monohydrate.sk.md',
          'utf-8',
        ),
      },
    );

    await this.productsService.addProductImage(
      creatineMonohydrate.id,
      this.encodeToBase64(
        __dirname + '/../../prisma/seed/data/images/creatine-monohydrate-1.jpg',
      ),
      'image/jpg',
    );

    const creatineGummies = await this.productsService.create({
      isPublic: true,
      slug: 'creatine-gummies',
      categoryId: creatineCategory.id,
    });

    await this.productsService.createProductTranslation(creatineGummies.id, {
      localeCode: this.localesService.locales().english.code,
      name: 'Creatine Gummies',
      description:
        'Packed with 5g of pure creatine per serving, these convenient, delicious gummies support muscle growth, improve strength, and enhance workout performance. No mixing, no mess—just pop, chew, and fuel your fitness goals. Perfect for busy days or on-the-go athletes!',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/creatine-gummies.en.md',
        'utf-8',
      ),
    });

    await this.productsService.createProductTranslation(creatineGummies.id, {
      localeCode: this.localesService.locales().slovak.code,
      name: 'Kreatín Gummies',
      description:
        'S obsahom 5g kreatínu, tieto praktické a chutné gumy podporujú rast svalov, zlepšujú silu a zvyšujú výkon počas tréningu. Žiadne miešanie, žiadny neporiadok - jednoducho zjedz, žuj a poháňaj svoje fitness ciele. Ideálne pre rušné dni alebo športovcov na cestách!',
      markdownContent: fs.readFileSync(
        __dirname + '/../../prisma/seed/data/content/creatine-gummies.sk.md',
        'utf-8',
      ),
    });

    await this.productsService.addProductImage(
      creatineGummies.id,
      this.encodeToBase64(
        __dirname +
          '/../../prisma/seed/data/images/creatine-monohydrate-gummies-1.jpg',
      ),
      'image/jpg',
    );

    const weight300g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '300g',
    });

    await this.productVariantsService.create({
      productId: creatineMonohydrate.id,
      sku: 'creatine-monohydrate-300g',
      priceInCents: 1599,
      stock: 100,
      isPublic: true,
      attributes: [weight300g.id],
    });

    const weight1000g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '1000g',
    });
    await this.productVariantsService.create({
      productId: creatineMonohydrate.id,
      sku: 'creatine-monohydrate-1000g',
      priceInCents: 3599,
      stock: 100,
      attributes: [weight1000g.id],
      isPublic: true,
    });

    const weight500g = await this.attributesService.create({
      keyId: weightKey.id,
      value: '500g',
    });

    await this.productVariantsService.create({
      productId: creatineGummies.id,
      sku: 'creatine-gummies-500g',
      priceInCents: 1999,
      stock: 100,
      attributes: [weight500g.id],
      isPublic: true,
    });

    this.logger.log('Products seeded.');

    this.logger.log('Embed product data into Qdrant vector database...');
    for (const product of [creatineMonohydrate, creatineGummies]) {
      for (const locale of this.localesService.findAll()) {
        await this.productsService.generateProductEmbeddings(
          product.id,
          locale.code,
        );
      }
    }

    while (
      (await this.llmTasksQueue.getJobCountByTypes(
        'waiting',
        'active',
        'wait',
        'delayed',
      )) > 0
    ) {
      this.logger.log('Waiting for LLM tasks to complete...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    this.logger.log('Product data embedded into Qdrant vector database.');

    this.logger.log('Seeding orders...');
    // seed orders
    const items = await this.prismaService.productVariant.findMany({
      take: 3,
    });
    const users = await this.prismaService.user.findMany();
    for (const user of users) {
      await this.prismaService.order.create({
        data: {
          userId: user.id,
          totalInCents: items.reduce((sum, item) => sum + item.priceInCents, 0),
          orderItems: {
            createMany: {
              data: items.map((item) => ({
                productVariantId: item.id,
                quantity: 1,
                sku: item.sku,
                unitPriceInCents: item.priceInCents,
              })),
            },
          },
          status: 'DELIVERED',
          shippingDetails: {
            create: {
              country: 'Slovakia',
              city: 'Bratislava',
              postalCode: '12312',
              line1: 'Dunajska 123',
              line2: '8A',
              name: `${user.firstName} ${user.lastName}`,
              phone: '+421123123123',
              state: null,
            },
          },
        },
      });
      this.logger.log('Seeding completed.');
    }
  }

  private encodeToBase64(file: string) {
    return fs.readFileSync(file, { encoding: 'base64' });
  }
}
